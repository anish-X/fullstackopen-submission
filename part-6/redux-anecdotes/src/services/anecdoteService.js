const baseURL = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await fetch(baseURL);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();
  return data;
};

const create = async (content) => {
  if (!content) return;

  const response = await fetch(baseURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, votes: 0 }),
  });

  if (!response.ok) {
    throw new Error("Failed to create anecdote");
  }

  return await response.json();
};

const vote = async (anecdote) => {
  const response = await fetch(`${baseURL}/${anecdote.id}`, {
    method: "PUT",
    header: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...anecdote, votes: anecdote.votes + 1 }),
  });

  if (!response.ok) {
    throw new Error("Failed to vote anecdote");
  }

  return await response.json();
};

export default { getAll, create, vote };
