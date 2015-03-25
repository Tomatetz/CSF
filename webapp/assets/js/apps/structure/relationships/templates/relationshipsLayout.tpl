<ul class="nav nav-tabs">
    <li class="active">
        <a data-target="[data-id='parent']" data-toggle="tab">Derived from <span class="badge parent_badge" style='padding: 2px 7px;'><!--<%= parents_quantity %>--></span></a>
    </li>
    <li>
        <a data-target="[data-id='children']" data-toggle="tab">Led to <span class="badge children_badge" style='padding: 2px 7px;'><!--<%= children_quantity %>--></span></a>
    </li>
    <li>
        <a data-target="[data-id='ancestors']" data-toggle="tab">Path</a>
    </li>
</ul>

<div class="tab-content">
    <div class="tab-pane active" data-id="parent">
        <br>
        <div id="parent-region"></div>
    </div>
    <div class="tab-pane" data-id="children">
        <br>
        <div id="children-region"></div>
    </div>
    <div class="tab-pane" data-id="ancestors">
        <br>
        <div id="ancestors-region"></div>
    </div>
</div>