interface Config {
    baseUrl: string;
}

const config: Record<string, Config> = {
    development: {
        baseUrl: 'http://localhost:8080',
    },
    production: {
        baseUrl: 'https://crm-project-backend.onrender.com',
    },
};

const environment = process.env.NODE_ENV || 'development';

export default config[environment];
