# Creating Custom Themes

### Define the name of your theme

We will be calling this new theme `foundation-theme`, inspired by Zurb's Foundation:

```html
<tag-input [ngModel]="items"
           [theme]="'foundation-theme'">
</tag-input>
```

### Define the style for the new theme

Let's say we created the file `foundation-themes.scss`. We will need to:
- import the core styles from the `ng2-tag-input` package
- define our themes for container, tag and icon (if you want)
- apply the new themes

#### Importing the core styles
In order to get the mixins to style the component, you should first import them:

```scss
@import "~node_modules/ngx-chips/core/styles/core/_core.scss";
```

In order to understand what to define in your theme - [check out the sass mixins](https://github.com/gbuomprisco/ng2-tag-input/blob/master/modules/components/styles/core/_mixins.scss)

#### Defining a theme

Once the mixins are imported, you can use them to define new themes:

```scss
$foundation-theme: (
    container-border-bottom: 1px solid $foundation-primary
);
```

You can find all the mixin's possible values here.

#### Applying the mixins
The theme's name will be attached to the .ng2-tag-input class. In this way, we can combine the selectors, and define the new theme:

```scss
:ng-deep .ng2-tag-input.foundation-theme {
    @include tag-input-theme($foundation-theme);
}
```

#### Example theme

```scss
@import "../../modules/components/styles/core/_core.scss";

$foundation-primary: #1779ba;
$foundation-primary-dark: darken($foundation-primary, 10%);

// this is the container's theme
$foundation-theme: (
    container-border-bottom: 1px solid $foundation-primary
);

// this is the tag's theme
$foundation-tag-theme: (
    background: $foundation-primary,
    background-focused: $foundation-primary-dark,
    background-active: $foundation-primary-dark,
    background-hover: $foundation-primary-dark,
    color: #fff,
    color-hover: #fff,
    border-radius: 2px
);

// this is the delete icon's theme
$foundation-icon-theme: (
    fill: #fff,
    fill-focus: #eee,
    transition: all 0.35s
);

// apply theme to the container
:ng-deep .ng2-tag-input.foundation-theme {
    @include tag-input-theme($foundation-theme);
}

// apply theme to the tags
:ng-deep .ng2-tag-input.foundation-theme tag {
    @include tag-theme($foundation-tag-theme);
}

// apply theme to the delete icon
:ng-deep .ng2-tag-input.foundation-theme tag delete-icon {
    @include icon-theme($foundation-icon-theme);
}
```
