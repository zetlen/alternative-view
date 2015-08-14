# alternative-view
### version 0.1.0

Declarative logic-driven template selection for Mozu storefronts

http://www.infinitelooper.com/?v=6_9blTxwFeA&p=n#/110;123


## An alternative view?

Mozu Themes are incredibly powerful, but there are just a couple of places where you might wish they had more power than they do. For instance, in your `theme.json` file, you declare `pageTypes` that bind a type of storefront page to a particular Hypr template:

```json
        {
            "documentType": "web_page",
            "entityType": "webpage",
            "id": "home",
            "template": "home",
            "title": "Home Page",
            "userCreatable": true
        },
```

This declares that webpages assigned the "home" template must use a template in the theme called `templates/pages/home.hypr`. (The `"template"` configuration option expects the name of a file in that particular directory.)

In SiteBuilder, a merchant can assign web pages (or product pages, or category pages!) to alternate templates one by one, by changing their Page Settings.

But what if you want to do this dynamically?

### AlternativeView can change the Hypr template a page uses based on rules.

Install AlternativeView, and then add rules to your Action Configuration. Want to change the template of a category page if a URL query parameter `alternate` is set to `true`? Add a template called `category–alternate.hypr` to the `templates/pages` folder of your theme, and then add the following rule to your `configuration` in Action Configurations:

```json
"rules": [{
  "type": "queryparams",
  "params": {
    "alternate": true
  },
  "viewName": "category-alternate"
}]
```