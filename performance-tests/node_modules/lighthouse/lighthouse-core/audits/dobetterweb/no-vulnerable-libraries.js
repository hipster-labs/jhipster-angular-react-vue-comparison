/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Audits a page to make sure there are no JS libraries with
 * known vulnerabilities being used. Checks against a vulnerability db
 * provided by Snyk.io and checked in locally as third-party/snyk/snapshot.json
 */

'use strict';

const Audit = require('../audit.js');
const Sentry = require('../../lib/sentry.js');
const semver = require('semver');
const snykDatabase = require('../../../third-party/snyk/snapshot.json');

const SEMVER_REGEX = /^(\d+\.\d+\.\d+)[^-0-9]+/;

/** @typedef {{npm: Object<string, Array<{id: string, severity: string, semver: {vulnerable: Array<string>}}>>}} SnykDB */
/** @typedef {{severity: string, numericSeverity: number, library: string, url: string}} Vulnerability */

class NoVulnerableLibrariesAudit extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'no-vulnerable-libraries',
      title: 'Avoids front-end JavaScript libraries'
        + ' with known security vulnerabilities',
      failureTitle: 'Includes front-end JavaScript libraries'
        + ' with known security vulnerabilities',
      description: 'Some third-party scripts may contain known security vulnerabilities ' +
        'that are easily identified and exploited by attackers. ' +
        '[Learn more](https://developers.google.com/web/tools/lighthouse/audits/vulnerabilities).',
      requiredArtifacts: ['Stacks'],
    };
  }

  /**
   * @return {SnykDB}
   */
  static get snykDB() {
    return snykDatabase;
  }

  /**
   * @return {Object<string, number>}
   */
  static get severityMap() {
    return {
      high: 3,
      medium: 2,
      low: 1,
    };
  }

  /**
   * Attempts to normalize the version.
   * @param {string|undefined} version
   * @return {string|undefined}
   */
  static normalizeVersion(version) {
    if (!version) return version;
    if (semver.valid(version)) return version;

    // converts 1.5 -> 1.5.0
    if (/^\d+\.\d+$/.test(version)) return `${version}.0`;
    // converts 1.0.0a-bunch-of-crap -> 1.0.0
    const versionMatch = version.match(SEMVER_REGEX);
    if (versionMatch) return versionMatch[1];
    // leave everything else untouched
    return version;
  }

  /**
   * @param {string} normalizedVersion
   * @param {LH.Artifacts.DetectedStack} lib
   * @param {SnykDB} snykDB
   * @return {Array<Vulnerability>}
   */
  static getVulnerabilities(normalizedVersion, lib, snykDB) {
    if (!lib.npm || !snykDB.npm[lib.npm]) {
      return [];
    }

    // Verify the version is well-formed first
    try {
      semver.satisfies(normalizedVersion, '*');
    } catch (err) {
      err.pkgName = lib.npm;
      // Report the failure and skip this library if the version was ill-specified
      Sentry.captureException(err, {level: 'warning'});
      return [];
    }

    // Match the vulnerability candidates from snyk against the version we see in the page
    const vulnCandidatesForLib = snykDB.npm[lib.npm];
    const matchingVulns = vulnCandidatesForLib.filter(vulnCandidate => {
      // Each snyk vulnerability comes with an array of semver ranges
      // The page is vulnerable if any of the ranges match.
      const hasMatchingVersion = vulnCandidate.semver.vulnerable.some(vulnSemverRange =>
        semver.satisfies(normalizedVersion, vulnSemverRange)
      );
      return hasMatchingVersion;
    });

    const vulns = matchingVulns.map(vuln => {
      return {
        severity: vuln.severity,
        numericSeverity: this.severityMap[vuln.severity],
        library: `${lib.name}@${normalizedVersion}`,
        url: 'https://snyk.io/vuln/' + vuln.id,
      };
    });

    return vulns;
  }

  /**
   * @param {Array<Vulnerability>} vulnerabilities
   * @return {string}
   */
  static highestSeverity(vulnerabilities) {
    const sortedVulns = vulnerabilities
      .sort((a, b) => b.numericSeverity - a.numericSeverity);
    return sortedVulns[0].severity;
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @return {LH.Audit.Product}
   */
  static audit(artifacts) {
    const foundLibraries = artifacts.Stacks.filter(stack => stack.detector === 'js');
    const snykDB = NoVulnerableLibrariesAudit.snykDB;

    if (!foundLibraries.length) {
      return {
        score: 1,
      };
    }

    let totalVulns = 0;
    /** @type {Array<{highestSeverity: string, vulnCount: number, detectedLib: LH.Audit.Details.LinkValue}>} */
    const vulnerabilityResults = [];

    const libraryVulns = foundLibraries.map(lib => {
      const version = this.normalizeVersion(lib.version) || '';
      const vulns = this.getVulnerabilities(version, lib, snykDB);
      const vulnCount = vulns.length;
      totalVulns += vulnCount;

      let highestSeverity;
      if (vulns.length > 0) {
        highestSeverity = this.highestSeverity(vulns).replace(/^\w/, l => l.toUpperCase());

        vulnerabilityResults.push({
          highestSeverity,
          vulnCount,
          detectedLib: {
            text: lib.name + '@' + version,
            url: `https://snyk.io/vuln/npm:${lib.npm}?lh=${version}&utm_source=lighthouse&utm_medium=ref&utm_campaign=audit`,
            type: 'link',
          },
        });
      }

      return {
        name: lib.name,
        npmPkgName: lib.npm,
        version,
        vulns,
        highestSeverity,
      };
    });

    let displayValue = '';
    if (totalVulns > 1) {
      displayValue = `${totalVulns} vulnerabilities detected`;
    } else if (totalVulns === 1) {
      displayValue = `${totalVulns} vulnerability detected`;
    }

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      {key: 'detectedLib', itemType: 'link', text: 'Library Version'},
      {key: 'vulnCount', itemType: 'text', text: 'Vulnerability Count'},
      {key: 'highestSeverity', itemType: 'text', text: 'Highest Severity'},
    ];
    const details = Audit.makeTableDetails(headings, vulnerabilityResults, {});

    return {
      score: Number(totalVulns === 0),
      displayValue,
      extendedInfo: {
        jsLibs: libraryVulns,
        vulnerabilities: vulnerabilityResults,
      },
      details,
    };
  }
}

module.exports = NoVulnerableLibrariesAudit;
