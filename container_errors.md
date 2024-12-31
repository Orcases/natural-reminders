# Debug Instructions:

DO NOT miss any of the below instructions:

1. Keep a record of break/fix and what worked and what didnt work in @container_debug.md. if our fix did not work mark it Failed and mark it Succeeded otherwise. If a problem is repeating, mention it in the container_debug.md file. Keep latest fixes on the top, maintain reverse order.
2. To fix typing issues, you can declare types in @/types folder
3. We are on a container environment, DO NOT install any new dependencies locally.
4. DO NOT install any new dependencies in the container, any new dependencies need to be add to dependency config files if they do not already exist there


# Extension Errors form the browser console


```bash
```


# Container Logs

```bash

→ dc up --build -d 
[+] Building 8.4s (10/11)                                                                                                                 docker:default
[+] Running 0/15s (10/11)                                                                                                                 docker:default 
[+] Building 8.8s (11/11) FINISHED                                                                                                        docker:default 
 => [natural internal] load build definition from Dockerfile                                                                                        0.0s
 => => transferring dockerfile: 523B                                                                                                                0.0s
 => [natural internal] load metadata for docker.io/library/node:20-alpine                                                                           0.6s 
 => [natural internal] load .dockerignore                                                                                                           0.0s
 => => transferring context: 231B                                                                                                                   0.0s 
 => [natural 1/7] FROM docker.io/library/node:20-alpine@sha256:426f843809ae05f324883afceebaa2b9cab9cb697097dbb1a2a7a41c5701de72                     0.0s
 => [natural internal] load build context                                                                                                           0.0s
 => => transferring context: 18.06kB                                                                                                                0.0s 
 => CACHED [natural 2/7] WORKDIR /app                                                                                                               0.0s
 => CACHED [natural 3/7] RUN apk add --no-cache python3 make g++                                                                                    0.0s
 => CACHED [natural 4/7] COPY package*.json ./                                                                                                      0.0s
 => CACHED [natural 5/7] RUN npm install --legacy-peer-deps                                                                                         0.0s
 => [natural 6/7] COPY . .                                                                                                                          0.0s 
 => ERROR [natural 7/7] RUN npm run build                                                                                                           8.0s 
------                                                                                                                                                   
 > [natural 7/7] RUN npm run build:                                                                                                                      
0.211                                                                                                                                                    
0.211 > natural-reminders@1.0.0 build                                                                                                                    
0.211 > tsc && vite build                                                                                                                                
0.211 
4.512 vite v5.4.11 building for production...
4.541 transforming...
7.987 ✓ 882 modules transformed.
7.992 x Build failed in 3.46s
7.993 error during build:
7.993 src/pages/Content/SlidePanel.js (4:9): "HiXMark" is not exported by "node_modules/@heroicons/react/24/outline/esm/index.js", imported by "src/pages/Content/SlidePanel.js".
7.993 file: /app/src/pages/Content/SlidePanel.js:4:9
7.993 
7.993 2: import { Panel, PanelHeader, PanelContent } from '@natural/ui/layouts/Panel';
7.993 3: import { FaLeaf } from 'react-icons/fa';
7.993 4: import { HiXMark } from '@heroicons/react/24/outline';
7.993             ^
7.993 5: export const SlidePanel = (props) => {
7.993 6:     const { isVisible, onClose } = props;
7.993 
7.993     at getRollupError (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/parseAst.js:396:41)
7.993     at error (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/parseAst.js:392:42)
7.993     at Module.error (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:15655:16)
7.993     at Module.traceVariable (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:16104:29)
7.993     at ModuleScope.findVariable (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:13887:39)
7.993     at ReturnValueScope.findVariable (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:5306:38)
7.993     at FunctionBodyScope.findVariable (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:5306:38)
7.993     at Identifier.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:5089:40)
7.993     at CallExpression.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2672:28)
7.993     at CallExpression.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:11313:15)
7.993     at Property.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2676:23)
7.993     at ObjectExpression.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2672:28)
7.993     at CallExpression.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2672:28)
7.993     at CallExpression.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:11313:15)
7.993     at ArrayExpression.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2672:28)
7.993     at Property.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2676:23)
7.993     at ObjectExpression.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2672:28)
7.993     at CallExpression.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2672:28)
7.993     at CallExpression.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:11313:15)
7.993     at ArrayExpression.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2672:28)
7.993     at Property.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2676:23)
7.993     at ObjectExpression.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2672:28)
7.993     at CallExpression.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2672:28)
7.993     at CallExpression.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:11313:15)
7.993     at ReturnStatement.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2676:23)
7.993     at BlockStatement.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2672:28)
7.993     at ArrowFunctionExpression.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2676:23)
7.993     at VariableDeclarator.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2676:23)
7.993     at VariableDeclaration.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2672:28)
7.993     at ExportNamedDeclaration.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:11776:27)
7.993     at Program.bind (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:2672:28)
7.993     at Module.bindReferences (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:15634:18)
7.993     at Graph.sortModules (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:21163:20)
7.993     at Graph.build (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:21066:14)
7.993     at async file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:21754:13
7.993     at async catchUnfinishedHookActions (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:21220:16)
7.993     at async rollupInternal (file:///app/node_modules/vite/node_modules/rollup/dist/es/shared/node-entry.js:21749:5)
7.993     at async build (file:///app/node_modules/vite/dist/node/chunks/dep-CB_7IfJ-.js:65443:14)
7.993     at async CAC.<anonymous> (file:///app/node_modules/vite/dist/node/cli.js:828:5)
------
[+] Running 0/1ent commit information was not captured by the build  error="failed to read current commit information with git rev-parse --is-inside-work
 ⠇ Service natural  Building                                                                                                                        8.8s 
failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1

```
