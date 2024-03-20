interface Config {
    baseUrl: string;
}

const config: Record<string, Config> = {
    development: {
        baseUrl: 'https://crm-project-backend.onrender.com',
    },
    production: {
        baseUrl: 'https://crm-project-backend.onrender.com',

    },
};

const environment = process.env.NODE_ENV || 'development';

export default config[environment];
