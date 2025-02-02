/*
 * Copyright 2022, Red Hat, Inc.
 * SPDX-License-Identifier: LGPL-2.1-or-later
 */

// eslint-disable-next-line no-extend-native
String.prototype.asJqueryComplaintId = function() {
    return this.replace(/\.|:/ug, "");
};

// User events methods

function toggle_OVAL_operator() { // eslint-disable-line no-unused-vars
    const operator_parent = this.parentNode.parentNode;
    operator_parent.classList.toggle('pf-m-expanded');
    const children_to_hide_or_show = get_child_of_element_with_selector(operator_parent, "ul"); // eslint-disable-line no-undef
    hide_or_show(children_to_hide_or_show); // eslint-disable-line no-undef
}

function show_OVAL_details(event) { // eslint-disable-line no-unused-vars
    const oval_details = get_child_of_element_with_selector( // eslint-disable-line no-undef
        event.currentTarget.param_this.parentNode,
        event.currentTarget.param_selector
    );
    oval_details.classList.toggle('pf-m-expanded')
    hide_or_show(oval_details); // eslint-disable-line no-undef
    event.currentTarget.param_this.textContent = self.textContent == 'Show test details' ? 'Hide test details' : 'Show test details';
    event.currentTarget.param_this.setAttribute('aria-label', event.currentTarget.param_this.textContent);
}

// OVAL graph generation constants


const CHECK_ATTRIBUTE_TO_TEXT = {
    "all": "All collected objects must meet the requirements given in the OVAL state for the OVAL test to evaluate to \"true\".",
    "at least one": "At least one collected object must meet the requirements given in the OVAL state for the OVAL test to evaluate to \"true\".",
    "none exist": "None of the collected objects must meet the requirements given in the OVAL state for the OVAL test to evaluate to \"true\".",
    "none satisfy": "None of the collected objects must meet the requirements given in the OVAL state for the OVAL test to evaluate to \"true\".",
    "only one": "Only one of the collected objects must meet the requirements given in the OVAL state for the OVAL test to evaluate to \"true\"."
};
const CHECK_EXISTENCE_ATTRIBUTE_TO_TEXT = {
    "all_exist": "The test requires that all objects defined by the OVAL object exist for the OVAL test to evaluate to \"true\".",
    "any_exist": "The test requires zero or more objects defined by the OVAL object to exist for the OVAL test to evaluate to \"true\".",
    "at_least_one_exists": "The test requires that there be at least one object defined by the OVAL object for the OVAL test to evaluate to \"true\".",
    "none_exist": "The test requires that none of the objects defined by the OVAL object exist for the OVAL test to evaluate to \"true\".",
    "only_one_exists": "The test requires only one of the object defined by the OVAL object to exist for the OVAL test to evaluate to \"true\"."
};
const NEGATION_COLOR = {
    'pf-m-green': 'pf-m-red',
    'pf-m-red': 'pf-m-green',
    '': ''
};
const NEGATION_ICON = {
    'fa-check': 'fa-times',
    'fa-times': 'fa-check',
    'fa-question-circle': 'fa-question-circle'
};
const COLOR_TRANSLATION = {
    'pf-m-green': '--pf-global--success-color--200',
    'pf-m-red': '--pf-global--danger-color--200',
    '': ''
};

const DIV = document.createElement("div");
const SPAN = document.createElement("span");

const BUTTON = document.createElement("button");
const ICON = document.createElement("i");
const CODE = document.createElement("code");

const LI = document.createElement("li");
const UL = document.createElement("ul");

const TABLE = document.createElement("table");
const THEAD = document.createElement("thead");
const TBODY = document.createElement("tbody");
const ROW = document.createElement("tr");
const COL = document.createElement("td");
const HEADER_COL = document.createElement("th");

const P = document.createElement("p");

const BR = document.createElement("br");
const B = document.createElement("b");

const SMALL = document.createElement("small");
const I = document.createElement("i");


// OVAL graph generation methods

window.addEventListener('load', () => {
    var selector = "table[id=rule-table] tbody[rule-id] button[id=show_hide_rule_detail_button]";
    var rule_buttons = document.querySelectorAll(selector);

    rule_buttons.forEach(async item => {
        var rule_id = await item.parentNode.parentNode.parentNode.getAttribute("rule-id").asJqueryComplaintId();
        generate_oval_tree(item, "oval_tree_of_rule_" + rule_id); // eslint-disable-line no-undef
        generate_oval_tree(item, "cpe_tree_of_rule_" + rule_id); // eslint-disable-line no-undef
        generate_cpe_al(item, "cpe_al_tree_of_rule_profile_platforms_" + rule_id); // eslint-disable-line no-undef
        generate_cpe_al(item, "cpe_al_tree_of_rule_group_platforms_" + rule_id); // eslint-disable-line no-undef
        generate_cpe_al(item, "cpe_al_tree_of_rule_rule_platforms_" + rule_id); // eslint-disable-line no-undef
    });
});

function get_base_of_tree(div_with_tree) {
    const data = div_with_tree.getAttribute("data");
    const tree_data = JSON.parse(data);

    const fragment = document.createDocumentFragment();
    const tree_element = fragment.appendChild(DIV.cloneNode());
    tree_element.className = "pf-c-tree-view pf-m-guides pf-m-no-background";
    const ul = UL.cloneNode();
    ul.className = "pf-c-tree-view__list";
    ul.setAttribute('role', "tree");
    tree_element.appendChild(ul);
    return { tree_data, fragment, ul };
}


function generate_cpe_al(self, div_id_with_data) { // eslint-disable-line no-unused-vars
    const divs_with_tree = self.parentNode.parentNode.parentNode.querySelectorAll(`div[id=${div_id_with_data}]`);

    divs_with_tree.forEach(div_with_tree => {
        if (div_with_tree.getAttribute("is_rendered") === 'true') {
            return;
        }
        const { tree_data, fragment, ul } = get_base_of_tree(div_with_tree);
        if (tree_data !== undefined) {
            ul.appendChild(get_CPL_AL_tree_node(tree_data));
            div_with_tree.appendChild(fragment);
            div_with_tree.setAttribute("is_rendered", 'true');
        }
    });
}


function generate_oval_tree(self, div_id_with_oval_graph_data) { // eslint-disable-line no-unused-vars
    const divs_with_tree = self.parentNode.parentNode.parentNode.querySelectorAll(`div[id=${div_id_with_oval_graph_data}]`);

    divs_with_tree.forEach(div_with_tree => {
        if (div_with_tree.getAttribute("is_rendered") === 'true') {
            return;
        }
        const { tree_data, fragment, ul } = get_base_of_tree(div_with_tree);
        if (tree_data !== undefined) {
            ul.appendChild(get_OVAL_tree_node(tree_data));
            div_with_tree.appendChild(fragment);
            div_with_tree.setAttribute("is_rendered", 'true');
        }
    });
}

function get_CPL_AL_tree_node(root) {
    if (root.node_type == 'frac-ref') {
        return undefined;
    }

    const root_node = get_CPE_AL_operator_node(root);
    if (root.children) {
        const ul = UL.cloneNode();
        ul.className = "pf-c-tree-view__list";
        ul.setAttribute('role', "group");
        const fragment = document.createDocumentFragment();
        for (const child of root.children) {
            if (child.node_type == "frac-ref") {
                fragment.appendChild(render_CPE_frac_ref(child));
            } else {
                fragment.appendChild(get_CPL_AL_tree_node(child));
            }
        }
        ul.appendChild(fragment);
        root_node.appendChild(ul);
    }
    return root_node;
}


function get_colors_and_icons(node_data) {
    let color = '';
    let icon = 'fa-question-circle';
    if (node_data.value == 'true') {
        color = 'pf-m-green';
        icon = 'fa-check';
    } else if (node_data.value == 'false') {
        color = 'pf-m-red';
        icon = 'fa-times';
    }

    let negate_color = '';
    let negate_icon = icon;
    if (node_data.negation) {
        negate_color = COLOR_TRANSLATION[NEGATION_COLOR[color]];
        negate_icon = NEGATION_ICON[icon];
    } else {
        negate_color = COLOR_TRANSLATION[color];
    }
    return { color, icon, negate_color, negate_icon };
}


function base_operator_node(node_data, node_text) {
    const { color, icon, negate_color, negate_icon } = get_colors_and_icons(node_data);
    const node = get_node(negate_color);
    node_text.appendChild(node);
    const html_icon = get_icon_as_html(negate_icon);
    node.appendChild(html_icon);
    if (node_data.negation) {
        node.appendChild(get_bold_text("NOT"));
        html_icon.classList.add("icon-space");
    }
    return { node, color, icon };
}

function get_CPE_AL_operator_node(node_data) {
    const { operator_node, node_text } = get_operator_node();
    const { node, color, icon } = base_operator_node(node_data, node_text);
    node.appendChild(get_bold_text(` ${node_data.node_type} `));
    node_text.appendChild(get_label(color, "CPE AL operator", undefined, "cpe-label"," cpe-label__content"));
    const span_space = SPAN.cloneNode();
    span_space.innerText = "\u00A0";
    node_text.appendChild(span_space);
    node_text.appendChild(get_label(color, node_data.value, get_icon_as_html(icon), "cpe-label", "cpe-label__content"));
    return operator_node;
}


function render_CPE_frac_ref(node_data) {
    const { operator_node, node_text } = get_operator_node();
    const { node, color, icon } = base_operator_node(node_data.oval_tree, node_text);

    node.appendChild(get_bold_text(` Reference to OVAL definition `));
    node_text.appendChild(get_label(color, "frac-ref", undefined, "cpe-label"," cpe-label__content"));
    const span_space = SPAN.cloneNode();
    span_space.innerText = "\u00A0";
    node_text.appendChild(span_space);
    node_text.appendChild(get_label(color, node_data.value, get_icon_as_html(icon), "cpe-label", "cpe-label__content"));

    const ul = UL.cloneNode();
    ul.className = "pf-c-tree-view__list";
    ul.setAttribute('role', "group");
    const fragment = document.createDocumentFragment();
    fragment.appendChild(get_OVAL_tree_node(node_data.oval_tree));

    ul.appendChild(fragment);
    operator_node.appendChild(ul);

    return operator_node;
}


function get_OVAL_tree_node(root) {
    if (root.node_type == 'value') {
        return undefined;
    }

    const root_node = get_OVAL_tree_operator_node(root);
    if (root.children) {
        const ul = UL.cloneNode();
        ul.className = "pf-c-tree-view__list";
        ul.setAttribute('role', "group");
        const fragment = document.createDocumentFragment();
        for (const child of root.children) {
            if (child.node_type == "value") {
                fragment.appendChild(render_OVAL_test(child));
            } else {
                fragment.appendChild(get_OVAL_tree_node(child));
            }
        }
        ul.appendChild(fragment);
        root_node.appendChild(ul);
    }
    return root_node;
}

function get_test_node() {
    const test_node = LI.cloneNode();
    test_node.className = "pf-c-tree-view__list-item";
    test_node.setAttribute("role", "treeitem");
    test_node.setAttribute("tabindex", "-1");

    const content = DIV.cloneNode();
    content.className = "pf-c-tree-view__content";
    test_node.appendChild(content);

    const node = DIV.cloneNode();
    node.className = "pf-c-tree-view__node";
    node.setAttribute("tabindex", "0");
    content.appendChild(node);

    const node_container = DIV.cloneNode();
    node_container.className = "pf-c-tree-view__node-container";
    node.appendChild(node_container);

    const node_content = DIV.cloneNode();
    node_content.className = "pf-c-tree-view__node-content";
    node_container.appendChild(node_content);

    const node_text = SPAN.cloneNode();
    node_text.className = "pf-c-tree-view__node-text";
    node_content.appendChild(node_text);

    return { test_node, node_content, node_text };
}

function render_OVAL_test(node_data) {
    const { test_node, node_content, node_text } = get_test_node();
    const { color, icon, negate_color, negate_icon } = get_colors_and_icons(node_data);

    const node = get_node(negate_color);
    node_text.appendChild(node);
    const html_icon = get_icon_as_html(negate_icon);
    node.appendChild(html_icon);
    if (node_data.negation) {
        node.appendChild(get_bold_text("NOT"));
        html_icon.classList.add("icon-space");
    }

    const test_id = node_data.node_id.replace("oval:ssg-", "").replace(":tst:1", "");
    node.appendChild(get_bold_text(` ${test_id} `));
    node_text.appendChild(get_label(color, node_data.tag));
    node_text.appendChild(get_label(color, node_data.value, get_icon_as_html(icon)));
    node_text.appendChild(get_note(`\u00A0\u00A0${node_data.comment ? node_data.comment : ""}`));

    const info_id = 'info_of_test_' + test_id.replace(/[\.:_\-]/ug, "");
    const button = BUTTON.cloneNode();
    button.className = "pf-c-button pf-m-inline pf-m-link";
    button.addEventListener("click", show_OVAL_details, false);
    button.param_this = button;
    button.param_selector = `[id=${info_id}]`;
    button.setAttribute("type", " button");
    button.setAttribute("aria-label", "Show test details");
    button.textContent = "Show test details";
    node_content.appendChild(button);

    const div = DIV.cloneNode();
    div.className = "pf-c-tree-view__node-container";
    div.setAttribute("id", info_id);
    div.style.display = "none";
    div.setAttribute("aria-label", "OVAL test info");
    node_content.appendChild(div);

    div.appendChild(get_OVAL_test_info(node_data.test_info));

    return test_node;
}

function get_icon_as_html(icon) {
    const html_icon = SPAN.cloneNode();
    html_icon.className = "pf-c-label__icon";

    const i = ICON.cloneNode();
    i.className = `fas fa-fw ${icon}`;
    i.setAttribute("aria-hidden", "true");
    html_icon.appendChild(i);
    return html_icon;
}

function get_node(color) {
    const node = SPAN.cloneNode();
    node.style.cssText = "color:var(" + color + ")";
    return node;
}

function get_bold_text(text) {
    const b = B.cloneNode();
    b.textContent = text;
    return b;
}

function get_tooltip(text) {
    const div = DIV.cloneNode();
    div.className = "tooltip-wrapper";

    const icon = ICON.cloneNode();
    icon.className = "fas fa-info-circle";
    icon.setAttribute("aria-hidden", "true");
    div.appendChild(icon);

    const tooltip_div = DIV.cloneNode();
    tooltip_div.className = "pf-c-tooltip pf-m-right-top tooltip-box-right-side";
    tooltip_div.setAttribute("role", "tooltip");
    div.appendChild(tooltip_div);

    const tooltip_arrow_div = DIV.cloneNode();
    tooltip_arrow_div.className = "pf-c-tooltip__arrow";
    tooltip_div.appendChild(tooltip_arrow_div);

    const tooltip_content_div = DIV.cloneNode();
    tooltip_content_div.className = "pf-c-tooltip__content tooltip__content-width";
    tooltip_content_div.textContent = text;
    tooltip_div.appendChild(tooltip_content_div);

    return div;
}

// eslint-disable-next-line max-params
function get_label(color, text, icon = undefined, cpe_al_class_label="", cpe_al_class_label__content="", tooltip_text=undefined) {
    const span = SPAN.cloneNode();
    if (!text) {
        return span;
    }
    span.className = `pf-c-label ${color} ${cpe_al_class_label}`;

    const content = SPAN.cloneNode();
    content.className = `pf-c-label__content ${cpe_al_class_label__content}`;
    content.textContent = text;
    if (icon !== undefined) {
        content.appendChild(icon);
    }
    if(tooltip_text !== undefined && tooltip_text) {
        content.className = `${content.className} tooltip-wrapper`;
        content.appendChild(get_tooltip(tooltip_text));
    }
    span.appendChild(content);
    return span;
}

function get_note(text) {
    const small = SMALL.cloneNode();
    const i = I.cloneNode();
    i.textContent = text;
    small.appendChild(i);
    return small;
}

function get_operator_node() {
    const operator_node = LI.cloneNode();
    operator_node.className = "pf-c-tree-view__list-item pf-m-expanded";
    operator_node.setAttribute("role", "treeitem");
    operator_node.setAttribute("aria-expanded", "true");
    operator_node.setAttribute("tabindex", "0");

    const content = DIV.cloneNode();
    content.className = "pf-c-tree-view__content";
    operator_node.appendChild(content);

    const button = BUTTON.cloneNode();
    button.className = "pf-c-tree-view__node";
    button.addEventListener("click", toggle_OVAL_operator);
    button.title = "Onclick shows or hides child nodes of the OVAL tree.";
    content.appendChild(button);

    const node_container = DIV.cloneNode();
    node_container.className = "pf-c-tree-view__node-container";
    button.appendChild(node_container);

    const node_toggle = DIV.cloneNode();
    node_toggle.className = "pf-c-tree-view__node-toggle";
    node_container.appendChild(node_toggle);

    const node_toggle_icon = SPAN.cloneNode();
    node_toggle_icon.className = "pf-c-tree-view__node-toggle-icon";
    node_toggle.appendChild(node_toggle_icon);

    const icon = ICON.cloneNode();
    icon.className = "fas fa-angle-right";
    icon.setAttribute("aria-hidden", "true");
    node_toggle_icon.appendChild(icon);

    const node_content = DIV.cloneNode();
    node_content.className = "pf-c-tree-view__node-content";
    node_container.appendChild(node_content);

    const node_text = SPAN.cloneNode();
    node_text.className = "pf-c-tree-view__node-text";
    node_content.appendChild(node_text);

    return { operator_node, node_text };
}

function get_OVAL_tree_operator_node(node_data) {
    const { operator_node, node_text } = get_operator_node();
    const { node, color, icon } = base_operator_node(node_data, node_text);

    node.appendChild(get_bold_text(` ${node_data.node_type} `));
    node_text.appendChild(get_label(color, node_data.tag));
    node_text.appendChild(get_label(color, node_data.value, get_icon_as_html(icon)));
    node_text.appendChild(get_note(`\u00A0\u00A0${node_data.comment ? node_data.comment : ""}`));

    return operator_node;
}

function get_table_header(objects) {
    const table_thead = THEAD.cloneNode();
    const row = ROW.cloneNode();
    row.setAttribute("role", "row");
    table_thead.appendChild(row);

    const fragment = document.createDocumentFragment();
    const header_col = HEADER_COL.cloneNode();
    header_col.setAttribute("role", "columnheader");
    header_col.setAttribute("scope", "col");
    header_col.className = "pf-m-truncate pf-m-fit-content";

    for (const item of get_header_items(objects)) {
        const clone_header_col = header_col.cloneNode();
        clone_header_col.textContent = format_header_item(item);
        fragment.appendChild(clone_header_col);
    }
    row.appendChild(fragment);
    return table_thead;
}

function get_table_body(objects) {
    const tbody = TBODY.cloneNode();
    tbody.setAttribute("role", "rowgroup");
    const rows_fragment = document.createDocumentFragment();

    const row = ROW.cloneNode();
    row.setAttribute("role", "row");

    const col = COL.cloneNode();
    col.setAttribute("role", "cell");
    col.className = "pf-m-truncate pf-m-fit-content";

    for (const object of objects) {
        const clone_of_row = row.cloneNode();
        rows_fragment.appendChild(clone_of_row);
        const cols_fragment = document.createDocumentFragment();
        for (const key in object) {
            const clone_of_col = col.cloneNode();
            clone_of_col.setAttribute("data-label", key);
            if(object[key] instanceof HTMLElement) {
                clone_of_col.appendChild(object[key]);
            } else {
                clone_of_col.textContent = object[key];
            }
            cols_fragment.appendChild(clone_of_col);
        }
        clone_of_row.appendChild(cols_fragment);
    }
    tbody.appendChild(rows_fragment);
    return tbody;
}

function get_info_paragraf(test_info) {
    const info_paragraf = P.cloneNode();
    if (test_info.oval_object.flag == "complete") {
        info_paragraf.textContent ='Following items have been found on the system: ';
    } else {
        info_paragraf.textContent ='No items have been found conforming to the following objects: ';
        info_paragraf.appendChild(BR.cloneNode());

        let bold_text = B.cloneNode();
        bold_text.textContent = test_info.oval_object.object_id;
        info_paragraf.appendChild(bold_text);
        info_paragraf.appendChild(document.createTextNode(" of type "));
        bold_text = B.cloneNode();
        bold_text.textContent = test_info.oval_object.object_type;
        info_paragraf.appendChild(bold_text);
    }
    return info_paragraf;
}

function generate_OVAL_object(test_info, div) {
    if (test_info.oval_object === undefined) {
        // eslint-disable-next-line no-console
        console.error("Error: The test information has no oval objects.");
        return;
    }
    div.appendChild(get_info_paragraf(test_info));
    const table_div = DIV.cloneNode();
    table_div.className = "pf-c-scroll-inner-wrapper oval-test-detail-table";
    div.appendChild(table_div);
    const table = TABLE.cloneNode();
    table.className = "pf-c-table pf-m-compact pf-m-grid-md";
    table.setAttribute("role", "grid");
    table_div.appendChild(table);

    const objects = [];
    for (const data of test_info.oval_object.object_data) {
        objects.push(filter_object(data, test_info.oval_object));
    }
    table.appendChild(get_table_header(objects));
    table.appendChild(get_table_body(objects));
}

function get_OVAL_state_labels(oval_state) {
    const div = DIV.cloneNode();
    const text = P.cloneNode();
    text.textContent ='This is expected state of OVAL object: ';
    text.appendChild(BR.cloneNode());

    div.appendChild(text);
    div.appendChild(get_label("", `${oval_state.state_id}\u00A0`, undefined, "", "", oval_state.comment));
    return div;
}

function generate_OVAL_state(test_info, div) {
    if (test_info.oval_state === null) {
        return;
    }
    div.appendChild(BR.cloneNode());
    div.appendChild(get_OVAL_state_labels(test_info.oval_state));
    const table_div = DIV.cloneNode();
    table_div.className = "pf-c-scroll-inner-wrapper oval-test-detail-table";
    div.appendChild(table_div);
    const table = TABLE.cloneNode();
    table.className = "pf-c-table pf-m-compact pf-m-grid-md";
    table.setAttribute("role", "grid");
    table_div.appendChild(table);

    const objects = [];
    objects.push(filter_object(test_info.oval_state.state_data, test_info.oval_state));

    table.appendChild(get_table_header(objects));
    table.appendChild(get_table_body(objects));
}


function generate_OVAL_error_message(test_info, div) {
    div.appendChild(BR.cloneNode());
    div.appendChild(BR.cloneNode());

    const alert_div = DIV.cloneNode();
    alert_div.className = "pf-c-alert pf-m-danger pf-m-inline";
    div.appendChild(alert_div);

    const icon_div = DIV.cloneNode();
    icon_div.className = "pf-c-alert__icon";
    alert_div.appendChild(icon_div);

    const icon = ICON.cloneNode();
    icon.className = "fas fa-fw fa-exclamation-circle";
    icon.setAttribute("aria-hidden", "true");
    icon_div.appendChild(icon);

    const title_div = DIV.cloneNode();
    title_div.className = "pf-c-alert__title";
    title_div.textContent = test_info.oval_object.message.level;
    alert_div.appendChild(title_div);

    const description_div = DIV.cloneNode();
    description_div.className = "pf-c-alert__description";
    description_div.textContent = test_info.oval_object.message.text;
    alert_div.appendChild(description_div);

    div.appendChild(BR.cloneNode());
}

function get_OVAL_test_info(test_info) {
    const div = DIV.cloneNode();
    div.className = "pf-c-accordion__expanded-content-body";
    div.appendChild(get_label("", `${test_info.test_id}\u00A0`, undefined, "", "", test_info.comment));
    if (test_info.check && test_info.check in CHECK_ATTRIBUTE_TO_TEXT) {
        div.appendChild(get_label("pf-m-cyan", `Check atribute: ${test_info.check}\u00A0`, undefined, "", "", CHECK_ATTRIBUTE_TO_TEXT[test_info.check]));
    }
    if (test_info.check_existence && test_info.check_existence in CHECK_EXISTENCE_ATTRIBUTE_TO_TEXT) {
        div.appendChild(get_label("pf-m-cyan", `Check existence atribute: ${test_info.check_existence}\u00A0`, undefined, "", "", CHECK_EXISTENCE_ATTRIBUTE_TO_TEXT[test_info.check_existence]));
    }

    if (test_info.oval_object.message !== null) {
        generate_OVAL_error_message(test_info, div);
    }

    generate_OVAL_object(test_info, div);
    generate_OVAL_state(test_info, div);
    return div;
}

function get_header_items(objects) {
    const out = [];
    for (const object of objects) {
        for (const key in object) {
            if (!out.includes(key)) {
                out.push(key);
            }
        }
    }
    return out;
}

function format_header_item(str) {
    const text = remove_uuid(str);
    const text_with_spaces = text.replace("_", " ");
    return text_with_spaces.charAt(0).toUpperCase() + text_with_spaces.slice(1);
}

function remove_uuid(str) {
    const index_special_char = str.indexOf('@');
    return str.substring(0, index_special_char != -1 ? index_special_char : str.length);
}

function filter_permissions(object) {
    const permission = {
        'uread': null,
        'uwrite': null,
        'uexec': null,
        'gread': null,
        'gwrite': null,
        'gexec': null,
        'oread': null,
        'owrite': null,
        'oexec': null
    };
    const new_object = {};
    Object.keys(object).forEach(key => {
        if (key in permission) {
            permission[key] = object[key];
        } else {
            new_object[key] = object[key];
        }
    });
    for (const key in permission) {
        if (permission[key] === null) {
            return object;
        }
    }
    let out = '';
    Object.keys(permission).forEach(key => {
        if (permission[key] == 'true') {
            switch (key.substring(1, key.length)) {
                case 'read':
                    out += "r";
                    break;
                case 'write':
                    out += "w";
                    break;
                case 'exec':
                    out += "x";
                    break;
                default:
                    // pass
                    break;
            }
        } else {
            out += "-";
        }
    });
    const permissions_code = CODE.cloneNode();
    permissions_code.textContent = out;
    new_object['permission'] = permissions_code;
    return new_object;
}

function filter_object(data, oval_object) {
    if (oval_object.object_type == 'textfilecontent54_object') {
        if ("filepath" in data && "text" in data) {
            return {
                "filepath": data["filepath"],
                "content": data["text"]
            };
        }
    }
    return filter_permissions(data);
}
