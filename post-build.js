var fs = require('fs');

const buildRoute = 'dist/apps/spotify';

const text = `RewriteEngine on
    # Don't rewrite files or directories
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]
    # Rewrite everything else to index.html to allow html5 state links
    RewriteRule ^ index.html [L]`;

fs.writeFile(`${buildRoute}/.htaccess`, text, (err) => {
  // throws an error, you could also catch it here
  if (err) throw err;

  // success case, the file was saved
  console.log('File created!');
});
