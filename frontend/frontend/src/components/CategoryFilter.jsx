function CategoryFilter({ categories, onChange }) {
  return (
    <div className="mb-3">
      <select className="form-select" onChange={e => onChange && onChange(e.target.value)}>
        <option value="">Todas las categorías</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.nombre}</option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;