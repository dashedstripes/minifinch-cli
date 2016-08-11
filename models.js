const constants = require('./constants');

const groups = {
  title: 'Groups',
  name: constants.groups,
  dependencies: []
};

const organizations = {
  title: 'Organizations',
  name: constants.organizations,
  dependencies: []
};

const brands = {
  title: 'Brands',
  name: constants.brands,
  dependencies: []
};

const ticket_fields = {
  title: 'Ticket Fields',
  name: constants.ticket_fields,
  dependencies: []
};

const user_fields = {
  title: 'User Fields',
  name: constants.user_fields,
  dependencies: []
};

const organization_fields = {
  title: 'Organization Fields',
  name: constants.organization_fields,
  dependencies: []
};

const ticket_forms = {
  title: 'Ticket Forms',
  name: constants.ticket_forms,
  dependencies: [
    constants.ticket_fields
  ]
}

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
  brands,
  ticket_fields,
  user_fields,
  organization_fields,
  ticket_forms,
  users,
  triggers,
  macros,
  views,
  automations,
  sla
]