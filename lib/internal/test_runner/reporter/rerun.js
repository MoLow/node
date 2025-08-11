'use strict';

const {
  ArrayPrototypePush,
  JSONStringify,
} = primordials;
const { relative } = require('path');
const { writeFileSync } = require('fs');

function reportReruns(previousRuns, rerunFilePath) {
  const cwd = process.cwd();
  return async function reporter(source) {
    const obj = { __proto__: null };

    for await (const { type, data } of source) {
      if (type === 'test:pass') {
        obj[`${relative(cwd, data.file)}:${data.line}:${data.column}`] = {
          __proto__: null,
          name: data.name,
          passed_attempt: data.details.passed_attempt ?? data.details.attempt,
        };
      }
    }

    ArrayPrototypePush(previousRuns, obj);
    writeFileSync(rerunFilePath, JSONStringify(previousRuns, null, 2), 'utf8');
  };
};

module.exports = {
  __proto__: null,
  reportReruns,
};
