const { pathsToModuleNameMapper } = require("ts-jest/utils");
const tsconfig = require("./tsconfig.json");

module.exports = {
	moduleFileExtensions: ["js", "json", "ts"],
	rootDir: "./",
	testRegex: ".*\\.spec\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest"
	},
	collectCoverageFrom: ["**/*.(t|j)s"],
	coverageDirectory: "../coverage",
	testEnvironment: "node",
	moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
		prefix: "<rootDir>"
	})
};
