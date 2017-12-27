# Changelog

## [Unreleased]

### Common

#### New Features

- Added typing file for ES5 global scripts (`dist/global/index.d.ts`).

#### Breaking Changes

- Modified the module bundle file name for ES6 bundling.

### Grid

#### Bug Fixes

- Header content is not scrolling while adding a record in empty Grid.
- `displayAsCheckbox` not working for numeric values.
- Filtered value not persisting in filter menu with date picker.
- Reordering with filter menu throws script error.
- Exporting Grouped Grid with Header not working.

## 15.4.22-preview (2017-12-14)

### Grid

#### New Features

- `recordDoubleClick` event added.

#### Bug Fixes

- Script error when pdf exporting with null values.

#### Breaking Changes

- Now `ColumnChooser` module must be injected to use column chooser feature.

#### Bug Fixes

- Grid height 100% is not working fixed.

## 15.4.21-preview (2017-12-08)

### Grid

#### Bug Fixes

- Script error when exporting with Custom aggregate fixed.
- State persistence in angular is not working fixed.
- Exporting with stacked header is not working fixed.
- Alignment issue with checkbox column fixed.
- Cancelling edit with edit Template fixed.
- Stacked header alignment issue fixed.
- Disabling Edit confirm dialog is not working issue fixed.
- Script error throws when save the record after edit in IE11 fixed.
- Editing not working after batch save in action begin event fixed.
- Deleting unsaved record throws Script error fixed.

## 15.4.20-preview (2017-12-01)

### Grid

#### Bug Fixes

- Column format is not applied when type is specified fixed
- Value search in checkbox filter is not worked for complex binding fixed
- Editing is not worked with stacked header fixed
- Numeric Edit column didn't get modified value when Enter key press fixed
- Null shows as date value in date type column fixed
- Edit Confirm Dialog is not working properly in batch edit mode fixed

## 15.4.19-preview (2017-11-23)

### Grid

#### Bug Fixes

- Script error resolved when exporting Grid data.
- Provided filter `menu` support for `template` columns.
- Localization is not found for `numeric` and `date` filter menu issue fixed.

## 15.4.18-preview (2017-11-16)

### Grid

#### Bug Fixes

- `enum` support for toolbar items provided.
- Edit state not changed when changing `dataSource` issue fixed.
- Duplicate service injection in React fixed.

## 15.4.17-preview (2017-11-13)

### Grid

Grid component is used to display and manipulate tabular data with configuration options to control the way the data is presented and manipulated.

- **Data sources** - Bind the Grid component with an array of JavaScript objects or DataManager.
- **Sorting and grouping** - Supports n levels of sorting and grouping.
- **Selection** - Provides the option to select the grid rows single or multiple.
- **Filtering** - Offers filter bar or menu , or checkbox at each column to filter data.
- **Editing** -  Provides the options to dynamically insert, delete and update records.
- **Virtualization** - Provides the options to load large amount of data without performance degradation.
- **Aggregates** - Provides built in types are sum , average, min, max, count.
- **Paging** - Provides the option to easily switch between pages using the pager bar.
- **Reordering** - Allows you to drag any column and drop it at any position in the Grid’s column header row, allowing columns to be repositioned.
- **Resize** - Allow you to resize the grid column width dynamically.
- **Frozen Rows And Columns** - Provides the options to freeze certain rows or columns to scroll remaining movable content.
- **Clipboard** - Provides an option to copy selected rows or cells data into clipboard.
- **Column Spanning** - Provides an option to allows to span the multiple adjacent cells.
- **Stacked Header** - It can be stacked or grouped in order to show multiple level of column headers.
- **Hierarchy Grid** - It is used to display table data in hierarchical structure which can show or hide by clicking on expand or collapse button.
- **Print and Exporting** - Provides the option to print and exporting grid records.
- **RTL** - Provides a full-fledged right-to-left mode which aligns content in the Grid component from right to left.
- **Localization** - Provides inherent support to localize the UI.
