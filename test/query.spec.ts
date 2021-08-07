/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./typings.d.ts"/>
import "@testing-library/jest-dom/extend-expect";
import { render, waitFor } from "@testing-library/svelte";

import Query from "../storybook/stories/query/App.svelte";

describe("Query", () => {
  it("should render the first query result before the second query result", async () => {
    const { getByText, getAllByText, queryByText } = render(Query);
    expect(getByText("Query loading...")).toBeInTheDocument();
    expect(queryByText("My Data 2")).toBeFalsy();
    await waitFor(() => getAllByText("Query 2 loading..."));
    await waitFor(() => getAllByText("My Data"));
    // doesnt seem to work/wait long enough. Dependent loading works though...
    await waitFor(() => getAllByText("My Data 2"));
  });
});
