module.exports = {
    'parser': 'babel-eslint',
    'extends': [
        'eslint:recommended',
    ],
    'env': {
        'node': true,
        'es6': true
    },
    'rules': {
        'no-unused-vars': [2, {"args": "none"}]
    }
};
