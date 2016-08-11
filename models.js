var groups = {
  title: 'Groups',
  name: 'groups',
  dependencies: []
};

var organizations = {
  title: 'Organizations',
  name: 'organizations',
  dependencies: []
};

var brands = {
  title: 'Brands',
  name: 'brands',
  dependencies: []
};

var ticket_fields = {
  title: 'Ticket Fields',
  name: 'ticket_fields',
  dependencies: []
};

var user_fields = {
  title: 'User Fields',
  name: 'user_fields',
  dependencies: []
};

var organization_fields = {
  title: 'Organization Fields',
  name: 'organization_fields',
  dependencies: []
};

var ticket_forms = {
  title: 'Ticket Forms',
  name: 'ticket_forms',
  dependencies: [
    'ticket_fields'
  ]
}

var users = {
  title: 'Users',
  name: 'users',
  dependencies: [
    'user_fields'
  ]
}

var triggers = {
  title: 'Triggers',
  name: 'triggers',
  dependencies: [
    'ticket_fields',
    'brands',
    'groups',
    'organizations'
  ]
}

var macros = {
  title: 'Macros',
  name: 'macros',
  dependencies: [
    'ticket_fields',
    'brands',
    'groups',
    'organizations'
  ]
};

var views = {
  title: 'Views',
  name: 'views',
  dependencies: [
    'ticket_fields',
    'brands',
    'groups',
    'organizations'
  ]
}

var automations = {
  title: 'Automations',
  name: 'automations',
  dependencies: [
    'ticket_fields',
    'brands',
    'groups',
    'organizations'
  ]
}

var sla = {
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