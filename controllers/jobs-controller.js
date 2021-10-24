const getAPIDocumentation = (req, res) => {
    res.send("API Documentation");
}

const createJob = (req, res) => {
    res.send("Create Job");
}

const editJob = (req, res) => {
    res.send("Edit Job");
}

const deleteJob = (req, res) => {
    res.send("Delete Job");
}

module.exports = {
    getAPIDocumentation,
    createJob,
    editJob,
    deleteJob
}