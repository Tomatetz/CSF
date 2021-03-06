/////////////////////////////////////////////////////////////////////////////////////////////
//
// This is the Javascript wrapper for Plugin-exported methods, used by Netscape.
//
//
// This file contains the all following functions that can be used from a web page:
//
//   cd_getFormula(objName, selection)
//   cd_getAnalysis(objName, selection)
//   cd_getMolWeight(objName, selection)
//   cd_getExactMass(objName, selection)
//   cd_getData(objName, dataType)
//   cd_putData(objName, dataType, data)
//   cd_clear(objName)
//
//
//
// All Rights Reserved.
// (version 1.016) October 6, 2005
/////////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////////
// Internal function to test if the structure is blank

function cd_isBlankStructure(objName, selection) {
	return (cd_getMolWeight(objName, selection) == 0);
}


/////////////////////////////////////////////////////////////////////////////////////////////
// Clear all drawings in the Plugin named *objName*

function cd_clear(objName) {
    if(cd_getSpecificObject(objName) && cd_getSpecificObject(objName).clear)
	    return cd_getSpecificObject(objName).clear();
}


/////////////////////////////////////////////////////////////////////////////////////////////
// Return the *Formula* of selected/all structures in the Plugin named *objName*

function cd_getFormula(objName, selection) {
	if (selection == null)
		selection = 0;

	var r = "";

	if (!cd_isBlankStructure(objName, selection))
		r = cd_getSpecificObject(objName).getFormula(selection) 

	return r;
}


/////////////////////////////////////////////////////////////////////////////////////////////
// Return the *Analysis* of selected/all structures in the Plugin named *objName*

function cd_getAnalysis(objName, selection) {
	if (selection == null)
		selection = 0;

	var r = "";

	if (!cd_isBlankStructure(objName, selection))
		r = cd_getSpecificObject(objName).getAnalysis(selection);

	return r;
}


/////////////////////////////////////////////////////////////////////////////////////////////
// Return the *Molecular Weight* of selected/all structures in the Plugin named *objName*

function cd_getMolWeight(objName, selection) {
	if (selection == null)
		selection = 0;

    if(cd_getSpecificObject(objName) && cd_getSpecificObject(objName).getMolWeight)
	    return cd_getSpecificObject(objName).getMolWeight(selection);
    else
        return null;
}


/////////////////////////////////////////////////////////////////////////////////////////////
// Return the *Exact Mass* of selected/all structures in the Plugin named *objName*

function cd_getExactMass(objName, selection) {
	if (selection == null)
		selection = 0;

	return cd_getSpecificObject(objName).getExactMass(selection);
}


/////////////////////////////////////////////////////////////////////////////////////////////
// Return version of Plugin

function cd_getVersion(objName) {
	return cd_getSpecificObject(objName).getData(-1);
}


/////////////////////////////////////////////////////////////////////////////////////////////
// Return the Coding String of *dataType* type from selected/all drawings in the Plugin named *objName*

function cd_getData(objName, mimetype, checkMW) {
	if (checkMW == null)
		checkMW = true;

	var dt = -1;

	mimetype.toLowerCase();

	if (mimetype == "chemical/x-cdx" || mimetype == "chemical/cdx") {
		dt = 0;
	}
	else if (mimetype == "chemical/x-mdl-molfile" || mimetype == "chemical/x-mdl-rxn" || mimetype == "chemical/mdl-molfile" || mimetype == "chemical/mdl-rxn") {
		dt = 1;
	}
	else if (mimetype == "chemical/x-daylight-smiles" || mimetype == "chemical/daylight-smiles") {
		dt = 2;
	}
	else if (mimetype == "chemical/x-questel-f1" || mimetype == "chemical/questel-f1") {
		dt = 3;
	}
	else if (mimetype == "chemical/x-questel-f1-query" || mimetype == "chemical/questel-f1-query") {
		dt = 4;
	}
	else if (mimetype == "text/xml") {
		dt = 5;
	}
	else if (mimetype == "chemical/x-name") {
		dt = 6;
	}
	else if (mimetype == "chemical/x-cml" || mimetype == "chemical/cml") {
		dt = 7;
	}
	else if (mimetype == "chemical/x-inchi" || mimetype == "chemical/inchi") {
		dt = 8;
	}
	else if (mimetype == "image/x-png" || mimetype == "image/png") {
		dt = 9;
	}
	else if (mimetype == "image/x-gif" || mimetype == "image/gif") {
		dt = 10;
	}
	else if (mimetype == "chemical/mdl-molfile-v3000" || mimetype == "chemical/x-mdl-molfile-v3000") {
		dt = 11;
	}
	else {
		dt = -1;
	}

	var r = "";

	if (dt >= 0 && (!checkMW || !cd_isBlankStructure(objName, 0)))
		r = cd_getSpecificObject(objName).getData(dt);
	else
		;// unknown mime type

	return r;
}


/////////////////////////////////////////////////////////////////////////////////////////////
// Set the Plugin named *objName* to *data* 

function cd_putData(objName, mimetype, data) {
	var dt = -1;

	mimetype.toLowerCase();

	if (mimetype == "chemical/x-cdx" || mimetype == "chemical/cdx") {
		dt = 0;
	}
	else if (mimetype == "chemical/x-mdl-molfile" || mimetype == "chemical/x-mdl-rxn" || mimetype == "chemical/mdl-molfile" || mimetype == "chemical/mdl-rxn") {
		dt = 1;
	}
	else if (mimetype == "chemical/x-daylight-smiles" || mimetype == "chemical/daylight-smiles") {
		dt = 2;
	}
	else if (mimetype == "chemical/x-questel-f1" || mimetype == "chemical/questel-f1") {
		dt = 3;
	}
	else if (mimetype == "chemical/x-questel-f1-query" || mimetype == "chemical/questel-f1-query") {
		dt = 4;
	}
	else if (mimetype == "text/xml") {
		dt = 5;
	}
	else if (mimetype == "chemical/x-name") {
		dt = 6;
	}
	else if (mimetype == "chemical/x-cml" || mimetype == "chemical/cml") {
		dt = 7;
	}
	else if (mimetype == "chemical/x-inchi" || mimetype == "chemical/inchi") {
		dt = 8;
	}
	else if (mimetype == "chemical/mdl-molfile-v3000" || mimetype == "chemical/x-mdl-molfile-v3000") {
		dt = 11;
	}
	else {
		dt = -1;
	}

	if (dt >= 0)
		cd_getSpecificObject(objName).putData(dt, data);
	else
		;// unknown mime type
}
