import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import {
  getSelectedIngredient,
  setSelectedIngredient
} from '../../services/slices/ingredients-slice';
import {
  RootState,
  useSelector,
  useDispatch
} from '../../services/store/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const selectedIngredient = useSelector(
    (state: RootState) => state.ingredients.selectedIngredient
  );

  useEffect(() => {
    if (id) {
      dispatch(getSelectedIngredient(id));
    }

    return () => {
      dispatch(setSelectedIngredient(null));
    };
  }, [dispatch, id]);

  if (!selectedIngredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={selectedIngredient} />;
};
