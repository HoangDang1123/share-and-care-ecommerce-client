import React from 'react'

export default function SizeGuide() {
  return (
    <table className="min-w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">Size</th>
          <th className="border border-gray-300 px-4 py-2">Chest (cm)</th>
          <th className="border border-gray-300 px-4 py-2">Waist (cm)</th>
          <th className="border border-gray-300 px-4 py-2">Length (cm)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-gray-300 px-4 py-2">XS</td>
          <td className="border border-gray-300 px-4 py-2">78-83</td>
          <td className="border border-gray-300 px-4 py-2">61-66</td>
          <td className="border border-gray-300 px-4 py-2">66-68</td>
        </tr>
        <tr>
          <td className="border border-gray-300 px-4 py-2">S</td>
          <td className="border border-gray-300 px-4 py-2">84-89</td>
          <td className="border border-gray-300 px-4 py-2">67-72</td>
          <td className="border border-gray-300 px-4 py-2">69-71</td>
        </tr>
        <tr>
          <td className="border border-gray-300 px-4 py-2">M</td>
          <td className="border border-gray-300 px-4 py-2">90-95</td>
          <td className="border border-gray-300 px-4 py-2">73-78</td>
          <td className="border border-gray-300 px-4 py-2">72-74</td>
        </tr>
        <tr>
          <td className="border border-gray-300 px-4 py-2">L</td>
          <td className="border border-gray-300 px-4 py-2">96-101</td>
          <td className="border border-gray-300 px-4 py-2">79-84</td>
          <td className="border border-gray-300 px-4 py-2">75-77</td>
        </tr>
        <tr>
          <td className="border border-gray-300 px-4 py-2">XL</td>
          <td className="border border-gray-300 px-4 py-2">102-107</td>
          <td className="border border-gray-300 px-4 py-2">85-90</td>
          <td className="border border-gray-300 px-4 py-2">78-80</td>
        </tr>
        <tr>
          <td className="border border-gray-300 px-4 py-2">XXL</td>
          <td className="border border-gray-300 px-4 py-2">108-113</td>
          <td className="border border-gray-300 px-4 py-2">91-96</td>
          <td className="border border-gray-300 px-4 py-2">81-83</td>
        </tr>
      </tbody>
    </table>
  );
}
