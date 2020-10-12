import "@testing-library/jest-dom/extend-expect";
import { render, waitFor } from "@testing-library/svelte";

import Queries from "../stories/queries/App.svelte";

describe("Queries", () => {
  it("should fetch 2 queries", async () => {
    const { getByText, getAllByText } = render(Queries);
    //@ts-ignore Property 'toBeInTheDocument' does not exist on type 'JestMatchersShape'
    expect(getByText("Query loading...")).toBeInTheDocument();
    //@ts-ignore
    expect(getByText("Query 2 loading...")).toBeInTheDocument();
    await waitFor(() => getAllByText("My Data"));
    await waitFor(() => getAllByText("My Data 2"));
  });
});
