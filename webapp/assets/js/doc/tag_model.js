/**
 * Structure tag model attributes
 * @module TagAttributes
 * @example
 *   category: "ADME/PK",
 *   color: "#AFDBAF",
 *   created_date: "2014-08-15T15:54:15.848+04:00",
 *   degree: "absent",
 *   degree_symbol: "a",
 *   deleted: false,
 *   is_status_tag: false,
 *   long_name: "CYP Inhibition absent",
 *   modified_date: "2014-08-15T15:54:15.848+04:00",
 *   name: "CYP Inhibition",
 *   short_name: "CYP Inhibition",
 *   tag_def_id: 110,
 *   weight: 10000"
 */
/**
 * Tag category
 * @typedef {Text}  category -  Tag category
 * @example category: "ADME/PK"
 * @name module:TagAttributes.category
 */
/**
 * If tag has degree, color is degree's color. Otherwise, color is tag color
 * @typedef {Text}  color -  Tag or degree color
 * @example color: "#AFDBAF"
 * @name module:TagAttributes.color
 */
/**
 * Tag creation date
 * @typedef {Text}  created_date -  Tag creation date
 * @example created_date: "2014-08-15T15:54:15.848+04:00"
 * @name module:TagAttributes.created_date
 */
/**
 * Tag degree (optional).
 * @typedef {Text} [degree] -  Tag degree
 * @example degree: "absent"
 * @name module:TagAttributes.degree
 */
/**
 * Tag degree symbol (optional)
 * @typedef {Text} [degree_symbol] -  Tag degree symbol
 * @example degree_symbol: "a"
 * @name module:TagAttributes.degree_symbol
 */
/**
 * Is tag deleted?
 * @typedef {Boolean} deleted -  Is tag deleted?
 * @example deleted: false
 * @name module:TagAttributes.deleted
 */
/**
 * Is tag status tag?
 * @typedef {Boolean} is_status_tag - Is tag status tag?
 * @example is_status_tag: false
 * @name module:TagAttributes.is_status_tag
 */
/**
 * Tag long name
 * @typedef {Text}  long_name - Tag long name (<a href="module-TagAttributes.html#name">Tag name</a> + <a href="module-TagAttributes.html#degree">degree</a>)
 * @example long_name: "CYP Inhibition absent"
 * @name module:TagAttributes.long_name
 */
/**
 * Tag modify date
 * @typedef {Text}  modified_date - Tag modify date
 * @example modified_date: "2014-08-15T15:54:15.848+04:00"
 * @name module:TagAttributes.modified_date
 */
/**
 * Tag name
 * @typedef {Text}  name - Tag name
 * @example name: "CYP Inhibition"
 * @name module:TagAttributes.name
 */
/**
 * Tag short name
 * @typedef {Text}  short_name - Tag short name
 * @example short_name: "CYP Inhibition"
 * @name module:TagAttributes.short_name
 */
/**
 * Tag id
 * @typedef {Number}  tag_def_id - Tag id
 * @example tag_def_id: 110
 * @name module:TagAttributes.tag_def_id
 */
/**
 * Tag weight
 * @typedef {Number}  weight - Tag weight
 * @example weight: 10000"
 * @name module:TagAttributes.weight
 */
