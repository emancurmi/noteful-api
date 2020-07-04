const path = require('path')
const express = require('express')
const xss = require('xss')
const FoldersServices = require('./folders-services')

const foldersRouter = express.Router()
const jsonParser = express.json()

foldersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        FolderServices.getAllFolders(knexInstance)
            .then(folders => {
                res.json(folders)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { title } = req.body
        const newFolder = { title }

        for (const [key, value] of Object.entries(newFolder)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        newFolder.title = title
        FolderServices.insertFolder(
            req.app.get('db'),
            newFolder
        )
            .then(folder => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl + `/${folder.id}`))
                    .json(folder)
            })
            .catch(next)
    })

foldersRouter
    .route('/:folder_id')
    .all((req, res, next) => {
        FolderServices.getById(
            req.app.get('db'),
            req.params.article_id
        )
            .then(folder => {
                if (!folder) {
                    return res.status(404).json({
                        error: { message: `Folder doesn't exist` }
                    })
                }
                res.folder = folder // save the article for the next middleware
                next() // don't forget to call next so the next middleware happens!
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json({
            id: res.folder.id,
        })
    })
    .delete((req, res, next) => {
        FolderServices.deleteFolder(
            req.app.get('db'),
            req.params.folder_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { title } = req.body
        const folderToUpdate = { title }

        const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'title'`
                }
            })
        }

        FolderServices.updateFolder(
            req.app.get('db'),
            req.params.folder_id,
            folderToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })


module.exports = foldersRouter