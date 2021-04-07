/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./typings.d.ts"/>
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, waitFor } from "@testing-library/svelte";

import IsFetching from "../storybook/stories/isFetching/App.svelte";

describe("IsFetching", () => {
  it("should render the fetching history", async () => {
    const { getByText, getAllByText } = render(IsFetching);
    expect(getByText("Query loading...")).toBeInTheDocument();
    expect(getByText("Query 2 loading...")).toBeInTheDocument();
    expect(getByText("[0]")).toBeInTheDocument();
    await waitFor(() => getAllByText("My Data"));
    expect(getByText("[0,2,1]")).toBeInTheDocument();
    await waitFor(() => getAllByText("My Data 2"));
    expect(getByText("[0,2,1,0]")).toBeInTheDocument();

    // refetch Query
    fireEvent.click(getByText("refetch Query"));
    await waitFor(() => getByText("Query loading..."));
    await waitFor(() => getAllByText("My Data"));
    expect(getByText("[0,2,1,0,1,0]")).toBeInTheDocument();
  });
});
