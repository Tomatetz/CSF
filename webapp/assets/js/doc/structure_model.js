/**
 * @module StructureAttributes
 * @example
 *   chemical_entity_id: 21293,
 *   chemical_entity_name: "TESTSTRUCTURE",
 *   created_by: {
 *    id: "fakeuserid",
 *    name: "Fake User"},
 *   created_date: "2014-12-04T00:57:31.016+04:00",
 *   deleted: false,
 *   displayed_name: "TESTSTRUCTURE",
 *   editable: true,
 *   item_type_id: "scaffold",
 *   modified_by: {
 *    id: "fakeuserid",
 *    name: "Fake User"},
 *   modified_date: "2015-01-19T16:08:27.475+04:00",
 *   note: "",
 *   nvp: null,
 *   project: {
 *    project_id: 13670,
 *    project_name: "test",
 *    ptt_code: null},
 *   project_id: "13670",
 *   series: {
 *    series_id: 21291,
 *    series_name: "sdf"},
 *   series_id: "21291",
 *   structure: "↵↵↵ 18 21  0  0  0  ...",
 *   tags: [{
 *      chemical_entity_id: 21293,
 *      created_by: {
 *         id: "fakeuserid"
 *         name: "Fake User"},
 *      created_date: "2014-12-04T00:57:31.097+04:00",
 *      deleted: false,
 *      modified_by: {
 *         id: "fakeuserid"
 *         name: "Fake User"},
 *      modified_date: "2014-12-04T00:57:31.097+04:00"
 *      tag_def_id: 162
 *      tag_definition: {
 *          category: "Status"
 *          color: "#D1AEE0"
 *          created_date: "2014-08-15T15:54:15.856+04:00"
 *          deleted: false
 *          is_status_tag: true
 *          long_name: "Starting Point"
 *          modified_date: "2014-08-15T15:54:15.856+04:00"
 *          name: "Starting Point"
 *          short_name: "Start"
 *          tag_def_id: 162
 *          weight: 60030}
 *      tag_id: 21297
 *      timestamp: "1417640251097.97164000"}]
 */
/**
 * Structure model properties
 * @property {Number}  project_id - Structure project id
 * @property {Number}  series_id - Structure series id
 * @property {Boolean}  editable - Is structure editable for current user?
 * @property {Number}  nvp - Structure NVP number
 * @property {Text}  item_type_id - Structure type (compounds/scaffolds)
 * @property {Text}  chemical_entity_name - Structure name
 * @property {Text}  structure - Structure molfile ({@link http://en.wikipedia.org/wiki/Chemical_table_file})
 * @property {Object}  project - Structure project data
 * @property {Number}  project.project_id - Structure project Id
 * @property {Text}  project.project_name - Structure project name
 * @property {Object}  series - Structure series data
 * @property {Number}  series.series_id - Structure series data
 * @property {Text}  series.series_name - Structure series name
 * @property {Text}  created_date - Structure creation date
 * @property {Object}  created_by - Structure creator data
 * @property {Text}  created_by.id - Creator id
 * @property {Text}  created_by.name - Creator name
 * @property {Object} modified_by - Structure modification data
 * @property {Text}  modified_by.id - Changer id
 * @property {Text}  modified_by.name - Changer name
 * @property {Boolean}  deleted - Is structure deleted?
 * @property {Text}  note - Structure notes
 * @property {Text}  displayed_name - Structure displayed name (nvp or chemical_entity_name)
 * @property {Array}  tags - More about tags: {@link module:TagAttributes}
 * @name module:StructureAttributes.model
 */

/**
 * Global
 * @name module:StructureAttributes
 */
