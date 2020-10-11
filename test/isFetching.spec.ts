import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, waitFor } from "@testing-library/svelte";

import IsFetching from "../stories/isFetching/IsFetching.svelte";

describe("IsFetching", () => {
  it("should render the fetching history", async () => {
    const { getByText, getAllByText } = render(IsFetching);
    //@ts-ignore
    expect(getByText("Query loading...")).toBeInTheDocument();
    //@ts-ignore
    expect(getByText("Query 2 loading...")).toBeInTheDocument();
    //@ts-ignore
    expect(getByText("[0]")).toBeInTheDocument();
    await waitFor(() => getAllByText("My Data"));
    //@ts-ignore
    expect(getByText("[0,2,1]")).toBeInTheDocument();
    await waitFor(() => getAllByText("My Data 2"));
    //@ts-ignore
    expect(getByText("[0,2,1,0]")).toBeInTheDocument();

    // refetch Query
    fireEvent.click(getByText("refetch Query"));
    await waitFor(() => getByText("Query loading..."));
    await waitFor(() => getAllByText("My Data"));
    //@ts-ignore
    expect(getByText("[0,2,1,0,1,0]")).toBeInTheDocument();
  });
});
