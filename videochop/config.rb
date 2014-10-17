require "compass"
require "breakpoint"

http_path = "/"
css_dir = "css"
sass_dir = "scss"
images_dir = "media/img"
javascripts_dir = "js"

line_comments = (environment == :production) ? :false : :true

sass_options = {:sourcemaps => true}
output_style = (environment == :production) ? :compressed : :expanded
