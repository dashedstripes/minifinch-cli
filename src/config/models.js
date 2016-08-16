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

const users = {
  title: 'Users',
  name: 'users',
  singular: 'user',
  dependencies: [
    'user_fields'
  ]
}

const triggers = {
  title: 'Triggers',
  name: 'triggers',
  dependencies: [
    'ticket_fields',
    'brands',
    'groups',
    'organizations'
  ]
}

const macros = {
  title: 'Macros',
  name: 'macros',
  dependencies: [
    'ticket_fields',
    'brands',
    'groups',
    'organizations'
  ]
};

const views = {
  title: 'Views',
  name: 'views',
  dependencies: [
    'ticket_fields',
    'brands',
    'groups',
    'organizations'
  ]
}

const automations = {
  title: 'Automations',
  name: 'automations',
  dependencies: [
    'ticket_fields',
    'brands',
    'groups',
    'organizations'
  ]
}

const sla = {
  title: 'SLA',
  name: 'sla',
  dependencies: [
    'ticket_fields',
    'brands',
    'groups',
    'organizations'
  ]
}

module.exports = [
  groups,
  organizations,
  ticket_fields,
  user_fields,
  organization_fields,
  ticket_forms,
  users,
  // triggers,
  // macros,
  // views,
  // automations,
  // sla
]