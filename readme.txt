\--build
|  \--css      -> Minified application.css and nomin CSS.
|  |  compiled -> CSS that is included in the minified file.
|  \--js       -> TODO
|  | **/*.html -> Compiled website HTML (can nest in folders).
\--source
|  \--css    -> CSS to be minified.
|  |  \nomin -> CSS to not be minified.
|  \--js     -> TODO
|  \--pug    -> Pug code.
|  \--scss   -> style.scss to be compiled and minified.


CSS
--------------------------------------------------
SCSS is compiled from [source/scss/style.scss] into [build/css/compiled/style.scss].
CSS is copied from [source/css] to [build/css/compiled].
All resulting CSS in [build/css/compiled] is minified into [build/css/application.css].
Anything in [source/css/nomin] is copied to [build/css] and is not included in the minified application.css.
