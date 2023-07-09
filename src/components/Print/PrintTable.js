import { MaterialReactTable } from "material-react-table";

const PrintableComponent = ({ category, columns }) => {
    return (
        <div>
            <MaterialReactTable
                columns={columns}
                data={category}
                getRowId={(row) => row.catid}
                enableEditing
                enablePagination={false}
                editingMode="row"
                layoutMode="grid"
                enableColumnOrdering
                enableColumnResizing
                enableColumnActions={false}
                enableClickToCopy={false}
                enableRowNumbers={false}
                enableRowVirtualization={false}
            />
        </div>
    );
};

export default PrintableComponent;