const constants = require('./constants');

const groups = {
  title: 'Groups',
  name: 'groups',
  singular: 'group',
  dependencies: []
};

const ticket_fields = {
  title: 'Ticket Fields',
  name: 'ticket_fields',
  singular: 'ticket_field',
  dependencies: []
};

const user_fields = {
  title: 'User Fields',
  name: 'user_fields',
  singular: 'user_field',
  dependencies: []
};


const organization_fields = {
  title: 'Organization Fields',
  name: 'organization_fields',
  singular: 'organization_field',
  dependencies: []
};

const organizations = {
  title: 'Organizations',
  name: 'organizations',
  singular: 'organization',
  dependencies: [
    'organization_fields'
  ]
};

const ticket_forms = {
  title: 'Ticket Forms',
  name: 'ticket_forms',
  singular: 'ticket_form',
  dependencies: [
    'ticket_fields'
  ]
}

const brands = {
  title: 'Brands',
  name: constants.brands,
  dependencies: []
};

const users = {
  title: 'Users',
  name: constants.users,
  dependencies: [
    constants.user_fields
  ]
}

const triggers = {
  title: 'Triggers',
  name: constants.triggers,
  dependencies: [
    constants.ticket_fields,
    constants.brands,
    constants.groups,
    constants.organizations
  ]
}

const macros = {
  title: 'Macros',
  name: constants.macros,
  dependencies: [
    constants.ticket_fields,
    constants.brands,
    constants.groups,
    constants.organizations
  ]
};

const views = {
  title: 'Views',
  name: constants.views,
  dependencies: [
    constants.ticket_fields,
    constants.brands,
    constants.groups,
    constants.organizations
  ]
}

const automations = {
  title: 'Automations',
  name: constants.automations,
  dependencies: [
    constants.ticket_fields,
    constants.brands,
    constants.groups,
    constants.organizations
  ]
}

const sla = {
  title: 'SLA',
  name: constants.sla,
  dependencies: [
    constants.ticket_fields,
    constants.brands,
    constants.groups,
    constants.organizations
  ]
}

module.exports = [
  groups,
  organizations,
  // brands,
  ticket_fields,
  user_fields,
  organization_fields,
  ticket_forms,
  // users,
  // triggers,
  // macros,
  // views,
  // automations,
  // sla
]