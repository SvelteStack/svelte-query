import "@testing-library/jest-dom/extend-expect";
import { render, waitFor } from "@testing-library/svelte";

import Queries from "../stories/queries/Queries.svelte";

describe("App", () => {
  it("loading and data rendering", async () => {
    const { getByText, getAllByText } = render(Queries);
    //@ts-ignore
    expect(getByText("Query loading...")).toBeInTheDocument();
    //@ts-ignore
    expect(getByText("Query 2 loading...")).toBeInTheDocument();
    await waitFor(() => getAllByText("My Data"));
    await waitFor(() => getAllByText("My Data 2"));
  });
});
