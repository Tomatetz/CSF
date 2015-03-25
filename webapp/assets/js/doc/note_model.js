/**
 * Notes model attributes
 * @module NotesAttributes
 * @example
 * chemical_entity_id: 20508,
 * created_by: {
 *  id: "fakeuserid",
 *  name: "Fake User"},
 * created_date: "2015-01-19T15:16:53.852+04:00",
 * deleted: false,
 * editable: true,
 * modified_by: {
 *  id: "fakeuserid",
 *  name: "Fake User"},
 * modified_date: "2015-01-19T15:16:53.852+04:00",
 * note_id: 21638,
 * note_text: "A note",
 * timestamp: "1421666213852.852189000",
 * type: "note"
 */

/**
 * @property {Number}  chemical_entity_id - Structure Id
 * @property {Text}  note_text - Note text
 * @property {Number}  note_id - Note Id
 * @property {Text}  created_date - Note creation date
 * @property {Object}  created_by - Note creator data
 * @property {Number}  created_by.id - Creator id
 * @property {Text}  created_by.name - Creator name
 * @property {Object}  modified_by - Note modify data
 * @property {Number}  modified_by.id - Changer id
 * @property {Text}  modified_by.name - Changer name
 * @property {Text}  modified_date - Note modify date
 * @property {Boolean}  deleted - Is deleted?
 * @property {Boolean}  editable - Is editable?
 * @property {Text}  type - "note" as default
 * @name module:NotesAttributes.model
 */
