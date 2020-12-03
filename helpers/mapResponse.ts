export default (result: any) => {
  const auctionsTemp = [];
    for (let i = 0; i < result.rows.length; i += 1) {
    const auction = result.rows[i];
    const tempData: any = {};

    for (let j = 0; j < result.rowDescription.columns.length; j += 1) {
      const column = result.rowDescription.columns[j];

      tempData[column.name] = auction[j];
    }

    auctionsTemp.push(tempData);
  }

  return auctionsTemp;
}