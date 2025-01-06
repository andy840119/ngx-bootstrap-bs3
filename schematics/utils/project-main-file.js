"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectMainFile = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const project_targets_1 = require("./project-targets");
/** Looks for the main TypeScript file in the given project and returns its path. */
function getProjectMainFile(project) {
    var _a, _b;
    const buildOptions = (0, project_targets_1.getProjectTargetOptions)(project, 'build');
    if (!buildOptions.main && !buildOptions.browser) {
        throw new schematics_1.SchematicsException(`Could not find the project main file inside of the ` +
            `workspace config (${project.sourceRoot})`);
    }
    return (_b = (_a = buildOptions.main) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : buildOptions.browser.toString();
}
exports.getProjectMainFile = getProjectMainFile;
//# sourceMappingURL=project-main-file.js.map