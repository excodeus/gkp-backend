const {
    getAllHistoriesClient,
    getHistoryById,
} = require('../repositories/history_repository');

const getAllHistoryService = async () => {
    try {
        const histories = await getAllHistoriesClient();

        return { histories };
    } catch (error) {
        throw error;
    }
};

const getHistoryByIdService = async (historyId) => {
    try {
        const history = await getHistoryById(historyId);
        if (history === undefined) {
            throw new Error("History not found");
        }
        return history;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllHistoryService,
    getHistoryByIdService,
};
