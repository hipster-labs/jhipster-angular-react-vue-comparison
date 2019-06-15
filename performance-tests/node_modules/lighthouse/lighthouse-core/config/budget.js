/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @param {unknown} arr
 * @return {arr is Array<Record<string, unknown>>}
 */
function isArrayOfUnknownObjects(arr) {
  return Array.isArray(arr) && arr.every(isObjectOfUnknownProperties);
}

/**
 * @param {unknown} val
 * @return {val is Record<string, unknown>}
 */
function isObjectOfUnknownProperties(val) {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

/**
 * Returns whether `val` is numeric. Will not coerce to a number. `NaN` will
 * return false, however ±Infinity will return true.
 * @param {unknown} val
 * @return {val is number}
 */
function isNumber(val) {
  return typeof val === 'number' && !isNaN(val);
}

class Budget {
  /**
   * Asserts that obj has no own properties, throwing a nice error message if it does.
   * `objectName` is included for nicer logging.
   * @param {Record<string, unknown>} obj
   * @param {string} objectName
   */
  static assertNoExcessProperties(obj, objectName) {
    const invalidKeys = Object.keys(obj);
    if (invalidKeys.length > 0) {
      const keys = invalidKeys.join(', ');
      throw new Error(`${objectName} has unrecognized properties: [${keys}]`);
    }
  }

  /**
   * Asserts that `strings` has no duplicate strings in it, throwing an error if
   * it does. `arrayName` is included for nicer logging.
   * @param {Array<string>} strings
   * @param {string} arrayName
   */
  static assertNoDuplicateStrings(strings, arrayName) {
    const foundStrings = new Set();
    for (const string of strings) {
      if (foundStrings.has(string)) {
        throw new Error(`${arrayName} has duplicate entry of type '${string}'`);
      }
      foundStrings.add(string);
    }
  }

  /**
   * @param {Record<string, unknown>} resourceBudget
   * @return {LH.Budget.ResourceBudget}
   */
  static validateResourceBudget(resourceBudget) {
    const {resourceType, budget, ...invalidRest} = resourceBudget;
    Budget.assertNoExcessProperties(invalidRest, 'Resource Budget');

    /** @type {Array<LH.Budget.ResourceType>} */
    const validResourceTypes = [
      'total',
      'document',
      'script',
      'stylesheet',
      'image',
      'media',
      'font',
      'other',
      'third-party',
    ];
    // Assume resourceType is an allowed string, throw if not.
    if (!validResourceTypes.includes(/** @type {LH.Budget.ResourceType} */ (resourceType))) {
      throw new Error(`Invalid resource type: ${resourceType}. \n` +
        `Valid resource types are: ${ validResourceTypes.join(', ') }`);
    }
    if (!isNumber(budget)) {
      throw new Error(`Invalid budget: ${budget}`);
    }
    return {
      resourceType: /** @type {LH.Budget.ResourceType} */ (resourceType),
      budget,
    };
  }

  /**
   * @param {Record<string, unknown>} timingBudget
   * @return {LH.Budget.TimingBudget}
   */
  static validateTimingBudget(timingBudget) {
    const {metric, budget, tolerance, ...invalidRest} = timingBudget;
    Budget.assertNoExcessProperties(invalidRest, 'Timing Budget');

    /** @type {Array<LH.Budget.TimingMetric>} */
    const validTimingMetrics = [
      'first-contentful-paint',
      'first-cpu-idle',
      'interactive',
      'first-meaningful-paint',
      'max-potential-fid',
    ];
    // Assume metric is an allowed string, throw if not.
    if (!validTimingMetrics.includes(/** @type {LH.Budget.TimingMetric} */ (metric))) {
      throw new Error(`Invalid timing metric: ${metric}. \n` +
        `Valid timing metrics are: ${validTimingMetrics.join(', ')}`);
    }
    if (!isNumber(budget)) {
      throw new Error(`Invalid budget: ${budget}`);
    }
    if (typeof tolerance !== 'undefined' && !isNumber(tolerance)) {
      throw new Error(`Invalid tolerance: ${tolerance}`);
    }
    return {
      metric: /** @type {LH.Budget.TimingMetric} */ (metric),
      budget,
      tolerance,
    };
  }

  /**
   * More info on the Budget format:
   * https://github.com/GoogleChrome/lighthouse/issues/6053#issuecomment-428385930
   * @param {unknown} budgetJson
   * @return {Array<LH.Budget>}
   */
  static initializeBudget(budgetJson) {
    // Clone to prevent modifications of original and to deactivate any live properties.
    budgetJson = JSON.parse(JSON.stringify(budgetJson));
    if (!isArrayOfUnknownObjects(budgetJson)) {
      throw new Error('Budget file is not defined as an array of budgets.');
    }

    const budgets = budgetJson.map((b, index) => {
      /** @type {LH.Budget} */
      const budget = {};

      const {resourceSizes, resourceCounts, timings, ...invalidRest} = b;
      Budget.assertNoExcessProperties(invalidRest, 'Budget');

      if (isArrayOfUnknownObjects(resourceSizes)) {
        budget.resourceSizes = resourceSizes.map(Budget.validateResourceBudget);
        Budget.assertNoDuplicateStrings(budget.resourceSizes.map(r => r.resourceType),
          `budgets[${index}].resourceSizes`);
      } else if (resourceSizes !== undefined) {
        throw new Error(`Invalid resourceSizes entry in budget at index ${index}`);
      }

      if (isArrayOfUnknownObjects(resourceCounts)) {
        budget.resourceCounts = resourceCounts.map(Budget.validateResourceBudget);
        Budget.assertNoDuplicateStrings(budget.resourceCounts.map(r => r.resourceType),
          `budgets[${index}].resourceCounts`);
      } else if (resourceCounts !== undefined) {
        throw new Error(`Invalid resourceCounts entry in budget at index ${index}`);
      }

      if (isArrayOfUnknownObjects(timings)) {
        budget.timings = timings.map(Budget.validateTimingBudget);
        Budget.assertNoDuplicateStrings(budget.timings.map(r => r.metric),
          `budgets[${index}].timings`);
      } else if (timings !== undefined) {
        throw new Error(`Invalid timings entry in budget at index ${index}`);
      }

      return budget;
    });

    return budgets;
  }
}

module.exports = Budget;
