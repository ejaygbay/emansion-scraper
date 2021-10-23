const getAPIDocumentation = (req, res) => {
    res.send("API Documentation");
}

const createJob = (req, res) => {
    res.send("Create Job");
}

module.exports = {
    getAPIDocumentation,
    createJob
}