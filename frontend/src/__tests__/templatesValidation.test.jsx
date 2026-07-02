import fs from 'fs'
import path from 'path'
import {describe, test, expect} from 'vitest'
import { templates } from '../data/templates'

const templateDir = path.resolve('src/components/portfolio/templates')
// Array of all the ids of templates from template.js
const ids = templates.map(templates => templates.id)

describe('templates validation',() => {

    //#1 TEST 
    // to check duplicate ids and content in template.js
    test('Contains Unique template Ids in career-pilot/frontend/src/data/templates.js', () => {
      const duplicates = []

      ids.forEach((id,index) => {
        if(ids.indexOf(id) !== index && !duplicates.includes(id))
            duplicates.push(id)
      })

      //If duplicate ids found 
      expect(
        duplicates 
        // ,`Duplicate template ids found\n ${duplicates}\n`
      ).toEqual([])
    
    })

    //#2 TEST
    // To check templates having directory in portfolio/templates 
    // but not info in template.js to get rendered
    test('Portfolio template folders in career-pilot/frontend/src/components/portfolio/templates are registered in career-pilot/frontend/src/data/templates.js', () => {
      const folders = fs.readdirSync(templateDir)

      //stores all the templates not registered in template.js
      const missingTemplates = folders.filter(folder => !ids.includes(folder))

      expect(
        missingTemplates
        // ,`Templates were found to be missing from template.js from being rendered ${missingTemplates}`
      ).toEqual([])
    })

    test('Registered templates in career-pilot/frontend/src/data/templates.js have corresponding folders in career-pilot/frontend/src/components/portfolio/templates', () => {

      const folders = fs
        .readdirSync(templateDir, { withFileTypes: true })
        .filter(item => item.isDirectory())
        .map(item => item.name)

      const registeredIds = templates.map(
        template => template.id
      )
    
      const missingFolders = registeredIds.filter(
        id => !folders.includes(id)
      )
    
      expect(missingFolders).toEqual([])
    })
  }
)
