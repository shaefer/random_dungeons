const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_DIR = '../'; // Adjust this path to your project's root directory
const PATH_CONSTANTS_FILE = path.join(PROJECT_DIR, 'routes', 'pathConstants.js');
const ROUTES_INDEX_FILE = path.join(PROJECT_DIR, 'routes', 'index.js');
const HEADER_COMPONENT_FILE = path.join(PROJECT_DIR, 'components', 'Header.js');
const PAGES_DIR = path.join(PROJECT_DIR, 'pages');

function addRoute(routeName, routePath) {
  // Update pathConstants.js
  fs.appendFileSync(PATH_CONSTANTS_FILE, `    ${routeName.toUpperCase()}: "${routePath}",\n`);

  // Update routes/index.js
  let routesIndexContent = fs.readFileSync(ROUTES_INDEX_FILE, { encoding: 'utf8', flag: 'r' });
  const lazyImportLine = `const ${routeName} = React.lazy(() => import('../pages/${routeName}'))\n`;
  const newRouteLine = `    { path: PathConstants.${routeName.toUpperCase()}, element: <${routeName} /> },\n`;
  const updatedRoutesIndexContent = routesIndexContent.replace(/const routes = \[/, lazyImportLine + 'const routes = [\n' + newRouteLine);
  fs.writeFileSync(ROUTES_INDEX_FILE, updatedRoutesIndexContent);

  // Update Header.js
  let headerComponentContent = fs.readFileSync(HEADER_COMPONENT_FILE, { encoding: 'utf8', flag: 'r' });
  const newLink = `            <li className="nav-item">\n              <Link to={PathConstants.${routeName.toUpperCase()}}>${routeName}</Link>\n            </li>\n`;
  const updatedHeaderComponentContent = headerComponentContent.replace('</ul>', newLink + '          </ul>');
  fs.writeFileSync(HEADER_COMPONENT_FILE, updatedHeaderComponentContent);

  // Create new page component
  const pageComponentPath = path.join(PAGES_DIR, `${routeName}.js`);
  const pageComponentContent = `export default function ${routeName}() {
    return (
        <div>
            <h1>${routeName} page</h1>
        </div>
    )
}`;
  fs.writeFileSync(pageComponentPath, pageComponentContent);
}

// Example usage
const routeName = 'Dungeon'; // Use your route name here
const routePath = '/dungeon'; // Use your route path here

addRoute(routeName, routePath);
console.log(`Successfully added route ${routeName}!`);
