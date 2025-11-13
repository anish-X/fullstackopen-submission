import { useDispatch } from "react-redux";
import { setFilter } from "../reducers/filterReducer";

const FilterForm = () => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const filter = e.target.value;
    dispatch(setFilter(filter));
  };

  return (
    <div>
      filter <input onChange={(e) => handleChange(e)} />
    </div>
  );
};

export default FilterForm;
