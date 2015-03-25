
<br>
<form role="form" style="white-space: nowrap;">
    <div class="form-group">
        <!-- TODO use separate template -->
        <label>Search within</label>
        <div class="btn-group btn-group-justified"
             data-toggle="buttons" data-element="type">
            <label class="btn btn-sm btn-default active">
                <input type="radio" name="type"
                       id="All" value="structures"
                       checked> All
            </label>
            <label class="btn btn-sm btn-default">
                <input type="radio" name="type"
                       id="Compounds" value="compounds"> Compounds
            </label>
            <label class="btn btn-sm btn-default">
                <input type="radio" name="type"
                       id="Scaffolds" value="scaffolds"> Scaffolds
            </label>
        </div>
    </div>
    <div class="form-group">
        <label for="structureControl">Structure</label>

        <select class="form-control input-sm unclearable-control"
                name="search_type">
            <option value="substructure">Substructure</option>
            <option value="exact">Exact</option>
        </select>
    </div>
    <div class="form-group">
        <div class="panel panel-draw-structure js-structure-draw"></div>
    </div>
    <div class="form-group">
        <label for="structureControl">Structure names</label>
        <textarea name="names"
                  class="form-control input-sm"
                  id="structureControl"></textarea>
    </div>
    <div class="form-group">
        <label class="searchpage-tags-label">Tags</label>
        <div class="searchpage-tags-tooltip" style="display: block;">
            <span class="glyphicon glyphicon-btn glyphicon-info-sign"
                data-toggle="form-tooltip" data-placement="right" title=""
                data-original-title="<div class='search-form__tags-tooltip'><p class='searchpage-tags-tooltip-text'>Tags are a way to annotate Compounds and Scaffolds with controlled vocabulary.</p>
                    <div class='tag-tooltip-inner'><h1>Three search options</h1><img src='assets/img/tag_tooltip.png'>
                    <div><h2>Tag category</h2><p class='searchpage-tags-tooltip-text'>Tag category is an umbrella term for a number of tag names.
                     Searching by a tag category will display all structures that have at least one tag in this category.</p></div>
                    <div style='margin-top:20px;'><h2>Tag name</h2><p class='searchpage-tags-tooltip-text'>Tag name returns all structures that have any one of the
                     related specific tags (high, medium, low, for instance). It is a way to search for structures for
                      which something about a particular property is known, whether positive or negative.</p></div>
                      <div class='clearfix'></div>
                      <div style='margin-top:10px; max-width:400px'><h2>Specific tag</h2><p class='searchpage-tags-tooltip-text'>Specific tags return structures
                       that have that exact tag. Structures in CSF are tagged at this level.</p></div>
                    </div>">

                </span>
        </div>
        <div class="clearfix"></div>

        <div class="space-l">
            <div class="form-group">
                <label>Specific tags</label>
                <div data-element="tag-specific" class="form-control input-sm"></div>
                <input name="specific_tags" type="hidden" />
            </div>
            <div class="form-group">
                <label>Tag names</label>
                <div data-element="tag-names" class="form-control input-sm"></div>
                <input name="tag_names" type="hidden" />
            </div>
            <div class="form-group">
                <label>Tag Categories</label>
                <div data-element="tag-categories" class="form-control input-sm"></div>
                <input name="tag_categories" type="hidden" />
            </div>
        </div>
    </div>
    <div class="form-group">
        <label>Project code</label>
        <div data-element="project-code" class="form-control input-sm"></div>
        <input name="ptt_code" type="hidden" />
    </div>
    <div class="form-group">
        <label>Project name</label>
        <div data-element="project_name" class="form-control input-sm"></div>
        <input name="project_name" data-element="project-name" class="form-control input-sm" type="hidden"/>
    </div>
    <div class="form-group">
        <label>Target type</label>
        <div data-element="target-type" class="form-control input-sm"></div>
        <input name="target_type" type="hidden" />
    </div>
    <div class="form-group">
        <label>Target</label>
        <div data-element="target" class="form-control input-sm"></div>
        <input name="target" class="form-control input-sm" type="hidden"/>
    </div>
    <div class="text-right">
        <span class="btn-link space-r js-clear">Clear all fields</span>
        <button type="submit" class="btn btn-sm btn-default js-search">Search</button>
    </div>
</form>
<br><br>