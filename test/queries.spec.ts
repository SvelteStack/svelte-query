/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./typings.d.ts"/>
import "@testing-library/jest-dom/extend-expect";
import { render, waitFor } from "@testing-library/svelte";

import Queries from "../stories/queries/App.svelte";

describe("Queries", () => {
  it("should fetch 2 queries", async () => {
    const { getByText, getAllByText } = render(Queries);
    expect(getByText("Query loading...")).toBeInTheDocument();
    expect(getByText("Query 2 loading...")).toBeInTheDocument();
    await waitFor(() => getAllByText("My Data"));
    await waitFor(() => getAllByText("My Data 2"));
  });
});
