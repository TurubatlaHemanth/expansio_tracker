import Card from "../ui/Card";
import Select from "../ui/Select";
import Button from "../ui/Button";

export default function ExpenseFilters({
  category,
  sort,
  categories,
  onCategoryChange,
  onSortChange,
  onRefresh,
  loading
}) {
  const categoryOptions = [
    { value: "", label: "All categories" },
    ...categories.map((item) => ({
      value: item,
      label: item
    }))
  ];

  const sortOptions = [
    { value: "date_desc", label: "Date: newest first" }
  ];

  return (
    <Card>
      <div className="card-header card-header--row">
        <div>
          <h2>Filters</h2>
          <p>Refine the expense list and refresh the current server view.</p>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="filter-grid">
        <Select
          id="categoryFilter"
          label="Filter by category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={categoryOptions}
          disabled={loading}
        />

        <Select
          id="sort"
          label="Sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          options={sortOptions}
          disabled={loading}
        />
      </div>
    </Card>
  );
}
