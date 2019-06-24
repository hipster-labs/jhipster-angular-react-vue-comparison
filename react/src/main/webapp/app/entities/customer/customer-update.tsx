import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './customer.reducer';
import { ICustomer } from 'app/shared/model/customer.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ICustomerUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface ICustomerUpdateState {
  isNew: boolean;
}

export class CustomerUpdate extends React.Component<ICustomerUpdateProps, ICustomerUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { customerEntity } = this.props;
      const entity = {
        ...customerEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/customer');
  };

  render() {
    const { customerEntity, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="reactApp.customer.home.createOrEditLabel">
              <Translate contentKey="reactApp.customer.home.createOrEditLabel">Create or edit a Customer</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : customerEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="customer-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="customer-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="firstNameLabel" for="customer-firstName">
                    <Translate contentKey="reactApp.customer.firstName">First Name</Translate>
                  </Label>
                  <AvField
                    id="customer-firstName"
                    type="text"
                    name="firstName"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="lastNameLabel" for="customer-lastName">
                    <Translate contentKey="reactApp.customer.lastName">Last Name</Translate>
                  </Label>
                  <AvField
                    id="customer-lastName"
                    type="text"
                    name="lastName"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="genderLabel" for="customer-gender">
                    <Translate contentKey="reactApp.customer.gender">Gender</Translate>
                  </Label>
                  <AvInput
                    id="customer-gender"
                    type="select"
                    className="form-control"
                    name="gender"
                    value={(!isNew && customerEntity.gender) || 'MALE'}
                  >
                    <option value="MALE">{translate('reactApp.Gender.MALE')}</option>
                    <option value="FEMALE">{translate('reactApp.Gender.FEMALE')}</option>
                    <option value="OTHER">{translate('reactApp.Gender.OTHER')}</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="emailLabel" for="customer-email">
                    <Translate contentKey="reactApp.customer.email">Email</Translate>
                  </Label>
                  <AvField
                    id="customer-email"
                    type="text"
                    name="email"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') },
                      pattern: {
                        value: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$',
                        errorMessage: translate('entity.validation.pattern', { pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$' })
                      }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="phoneLabel" for="customer-phone">
                    <Translate contentKey="reactApp.customer.phone">Phone</Translate>
                  </Label>
                  <AvField
                    id="customer-phone"
                    type="text"
                    name="phone"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="addressLine1Label" for="customer-addressLine1">
                    <Translate contentKey="reactApp.customer.addressLine1">Address Line 1</Translate>
                  </Label>
                  <AvField
                    id="customer-addressLine1"
                    type="text"
                    name="addressLine1"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="addressLine2Label" for="customer-addressLine2">
                    <Translate contentKey="reactApp.customer.addressLine2">Address Line 2</Translate>
                  </Label>
                  <AvField id="customer-addressLine2" type="text" name="addressLine2" />
                </AvGroup>
                <AvGroup>
                  <Label id="cityLabel" for="customer-city">
                    <Translate contentKey="reactApp.customer.city">City</Translate>
                  </Label>
                  <AvField
                    id="customer-city"
                    type="text"
                    name="city"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="countryLabel" for="customer-country">
                    <Translate contentKey="reactApp.customer.country">Country</Translate>
                  </Label>
                  <AvField
                    id="customer-country"
                    type="text"
                    name="country"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/customer" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  customerEntity: storeState.customer.entity,
  loading: storeState.customer.loading,
  updating: storeState.customer.updating,
  updateSuccess: storeState.customer.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerUpdate);
