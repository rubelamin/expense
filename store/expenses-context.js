import { createContext, useReducer } from "react";

export const ExpensesContext = createContext({
  expenses: [],
  setExpenses: (expenses) => {},
  addExpense: ({ description, amount, date }) => {},
  deleteExpense: (id) => {},
  updateExpense: (id, { description, amount, date }) => {},
});

function expensesReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state];
    case "SET":
      const inverted = action.payload.reverse();
      return inverted;
    case "UPDATE":
      const updateableExpenseIndex = state.findIndex(
        (expense) => expense.id === action.payload.id
      );
      const updateableExpense = state[updateableExpenseIndex];
      const updatedItem = { ...updateableExpense, ...action.payload.data };
      const updatedExpenses = [...state];
      updatedExpenses[updateableExpenseIndex] = updatedItem;
      return updatedExpenses;
    case "DELETE":
      return state.filter((expense) => expense.id !== action.payload);
    default:
      return state;
  }
}

export default function ExpensesContextProvider({ children }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);

  function addExpense(expensesData) {
    dispatch({ type: "ADD", payload: expensesData });
  }

  function setExpenses(expenses) {
    dispatch({ type: "SET", payload: expenses });
  }

  function deleteExpense(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  function updateExpense(id, expensesData) {
    dispatch({ type: "UPDATE", payload: { id: id, data: expensesData } });
  }

  const value = {
    expenses: expensesState,
    setExpenses: setExpenses,
    addExpense: addExpense,
    deleteExpense: deleteExpense,
    updateExpense: updateExpense,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}
