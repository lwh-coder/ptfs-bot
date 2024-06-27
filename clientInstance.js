let clientInstance;

module.exports = {
    setClient: (client) => {
        clientInstance = client;
    },
    getClient: () => {
        return clientInstance;
    }
};
