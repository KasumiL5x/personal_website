\--build
|  \--css         -> Minified application.css and nomin CSS.
|  |  \--compiled -> CSS that is included in the minified file.
|  \--js          -> Minified application.js and nomin JS.
|  |  \--compiled -> JS that is included in the minified file.
|  | **/*.html    -> Compiled website HTML (can nest in folders).
\--source
|  \--css      -> CSS to be minified together.
|  |  \--nomin -> CSS to not be minified.
|  \--js       -> JS to be minified together.
|  |  \--nomin -> JS to not be minified.
|  \--pug      -> Pug code.
|  \--scss     -> style.scss to be compiled and minified.


CSS
--------------------------------------------------
SCSS is compiled from [source/scss/style.scss] into [build/css/compiled/style.css].
CSS is copied from [source/css] to [build/css/compiled].
All resulting CSS in [build/css/compiled] is minified into [build/css/application.css].
Anything in [source/css/nomin] is copied to [build/css] and is not included in the minified application.css.

JS
--------------------------------------------------
JS is copied from [source/js] to [build/js/compiled].
All resulting JS in [build/js/compiled] is minified into [build/js/application.js].
Anything in [source/js/nomin] is copied to [build/js] and is not included in the minified application.js.
