# Relationship Project Context

This project is a landing page for the Couple Reconnect System, incorporating a checkout flow via an embedded Mengantar checkout form.

## Language

**Mengantar Form Widget**:
A custom HTML custom-element (`<mengantar-form-widget>`) provided by the `form.id` service that renders the checkout and shipping order form.
_Avoid_: order form, checkout block

**Scalev Whitelist**:
The Content Security Policy (CSP) whitelist configuration in the Scalev dashboard that controls which external domains are permitted to load scripts, styles, fonts, and API resources on the deployed page.
_Avoid_: domain whitelist, scalev security settings
