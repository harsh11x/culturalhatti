module.exports = {
    apps: [
        {
            name: 'culturalhatti-backend',
            script: 'npm',
            args: 'start',
            cwd: './backend',
            env: {
                NODE_ENV: 'production',
                PORT: 3001,
            },
        },
        {
            name: 'culturalhatti-admin',
            script: 'npm',
            args: 'run dev',
            cwd: './admin',
            env: {
                NODE_ENV: 'development',
                PORT: 3002,
            },
        },
        {
            name: 'culturalhatti-frontend',
            script: 'npm',
            args: 'run start',
            cwd: './frontend',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
        },
    ],
};
