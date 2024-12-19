import React, { useMemo } from "react";
import ResizableBox from "../ResizableBox";
import useDemo from "~hooks/useDemo";
import { AxisOptions, Chart } from "react-charts";
import { Container } from "./styles";

type Props = {
  title: string;
}

export function Charts({ title }: Props) {
  const { data } = useDemo({
    series: 1,
    dataType: "time",
  });

  const primaryAxis = useMemo<AxisOptions<typeof data[number]["data"][number]>>(
    () => ({
      getValue: (datum) => datum.primary as Date,
    })
  , []);

  const secondaryAxes = useMemo<AxisOptions<typeof data[number]["data"][number]>[]>(
    () =>
      [
        {
          getValue: (datum) => datum.secondary,
          stacked: true,
          // OR
          // elementType: "area",
        },
      ]
  , []);

  return (
    <Container>
      <p>{title}</p>
      <ResizableBox
        width={1084}
      >
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
          }}
          style={{
            width: '100%'
          }}
        />
      </ResizableBox>
    </Container>
  );
}
