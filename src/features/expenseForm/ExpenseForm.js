import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Formik, Form, useFormik, FieldArray } from 'formik'
import * as yup from 'yup'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from '@mui/material'
import Preview from './Preview'
import ExpenseTab from '../expenseTab/ExpenseTab'

const ExpenseForm = () => {
  const uploadBillImgRef = useRef()
  const [isBillForm, setIsBillForm] = useState(false)

  const [users] = useState([
    { name: 'Tue', avatar: 'https://images.sharp.com/doctors/Nguyen_Tue_56474_2012.jpg' },
    {
      name: 'Ga',
      avatar:
        'https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/02/Female_Portrait_1296x728-header-1296x729.jpg?w=1155&h=2268'
    },
    {
      name: 'Dude',
      avatar:
        'https://static.independent.co.uk/2020/10/30/08/newFile-2.jpg?width=640&auto=webp&quality=75'
    }
  ])

  const handleFixedCheck = (e, index) => {
    if (formik.values.members[index].fixed) {
      formik.handleChange(e)
      return
    }
    const fixedCnt = formik.values.members.reduce((cnt, current) => {
      if (current.fixed) {
        return ++cnt
      }
      return cnt
    }, 0)
    if (fixedCnt == formik.values.members.length - 1) {
      return
    }
    formik.handleChange(e)
  }
  const validationSchema = yup.object().shape({
    billDesc: yup.array().of(yup.string()),
    billPrice: yup.array().of(yup.number()),
    total: yup.number(),
    billImg: yup.object()
  })
  const initialValues = {
    name: 'Pizza',
    billDesc: [''],
    billPrice: [0],
    total: 0,
    billImg: null,
    billImgTotal: 0,
    members: [
      {
        uid: '123',
        owned: 0,
        note: 'Haha 123',
        fixed: false
      },
      {
        uid: '1231',
        owned: 0,
        note: 'Haha 123',
        fixed: false
      },
      {
        uid: '1223',
        owned: 0,
        note: 'Haha 123',
        fixed: false
      }
    ]
  }
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
    }
  })

  const clickUploadBill = () => {
    uploadBillImgRef.current.click()
  }
  const setImgValue = (e) => {
    console.log(e.target.files[0])
    const newMembers = [...formik.values.members]
    const average = formik.values.billImgTotal / newMembers.length
    newMembers.map((elem, index) => {
      elem.owned = average
    })
    formik.setValues({
      ...formik.values,
      billImg: e.target.files[0],
      members: newMembers,
      total: formik.values.billImgTotal
    })
  }
  const handleDescChange = (e, index) => {
    const billDescArr = [...formik.values.billDesc]
    billDescArr[index] = e.target.value
    formik.setValues({ ...formik.values, billDesc: billDescArr })
  }
  const getFixedTotal = (membersArr) => {
    return membersArr.reduce((fixedOwned, current) => {
      if (current.fixed) {
        return (fixedOwned += current.owned)
      }
      return fixedOwned
    }, 0)
  }
  const getFixedCount = (membersArr) => {
    return membersArr.reduce((count, current) => {
      if (current.fixed) {
        return ++count
      }
      return count
    }, 0)
  }
  const handleOwnedChange = (e, index) => {
    const value = Number(e.target.value)
    const newMembers = [...formik.values.members]
    newMembers[index].owned = value
    const fixedTotal = getFixedTotal(newMembers)
    if (
      value < 0 ||
      value > formik.values.total ||
      fixedTotal > formik.values.total ||
      !formik.values.members[index].fixed
    ) {
      console.log('returned')
      return
    }
    const fixedCount = getFixedCount(newMembers)
    const newAverage =
      (formik.values.total - fixedTotal) / (formik.values.members.length - fixedCount)
    newMembers.forEach((elem, i) => {
      if (!elem.fixed && i != index) {
        elem.owned = newAverage
      }
    })
    formik.setValues({
      ...formik.values,
      members: newMembers
    })
  }
  const getTotal = (billPriceArr) => {
    return billPriceArr.reduce((prev, curr) => prev + curr)
  }
  const handlePriceChange = (e, index) => {
    const value = Number(e.target.value)

    const billPriceArr = [...formik.values.billPrice]
    billPriceArr[index] = value

    const newMembers = [...formik.values.members]

    const newTotal = getTotal(billPriceArr)
    const fixedCount = getFixedCount(newMembers)
    const fixedTotal = getFixedTotal(newMembers)
    console.log(newTotal, fixedTotal)
    if (newTotal < fixedTotal) {
      return
    } else {
      const newAverage = (newTotal - fixedTotal) / (newMembers.length - fixedCount)
      newMembers.forEach((elem, index) => {
        if (!elem.fixed) {
          elem.owned = newAverage
        }
      })
      formik.setValues({
        ...formik.values,
        members: newMembers,
        billPrice: billPriceArr,
        total: newTotal
      })
    }
  }
  const editBillForm = (e, operation, index) => {
    const currLength = formik.values.billDesc.length

    const billDescArr = [...formik.values.billDesc]
    const billPriceArr = [...formik.values.billPrice]
    if (operation === 'add') {
      billDescArr[currLength] = ''
      billPriceArr[currLength] = 0
    } else if (operation === 'remove' && currLength > 1) {
      console.log(billPriceArr)
      billDescArr.splice(index, 1)
      console.log(billPriceArr.splice(index, 1))
      console.log(billPriceArr)
    }
    const newTotal = getTotal(billPriceArr)
    const fixedTotal = getFixedTotal(formik.values.members)
    if (newTotal < fixedTotal) {
      return
    }
    formik.setValues({
      ...formik.values,
      billPrice: billPriceArr,
      billDesc: billDescArr,
      total: newTotal
    })
  }
  const handleBillImgTotalChange = (e) => {
    const value = Number(e.target.value)
    const newTotal = value
    const newMembers = [...formik.values.members]

    const fixedCount = getFixedCount(newMembers)
    const fixedTotal = getFixedTotal(formik.values.members)
    if (newTotal < fixedTotal) {
      return
    } else {
      const newAverage = (newTotal - fixedTotal) / (newMembers.length - fixedCount)
      newMembers.forEach((elem, index) => {
        if (!elem.fixed) {
          elem.owned = newAverage
        }
      })
      formik.setValues({
        ...formik.values,
        members: newMembers,
        total: newTotal
      })
    }
  }
  const toggleBillForm = () => {
    const newMembers = [...formik.values.members]
    let newTotal = 0
    if (isBillForm) {
      newMembers.map((elem, index) => {
        elem.owned = 0
        elem.fixed = false
      })
    } else {
      newTotal = getTotal(formik.values.billPrice)
      const average = newTotal / newMembers.length
      newMembers.map((elem, index) => {
        elem.owned = average
        elem.fixed = false
      })
    }
    formik.setValues({ ...formik.values, total: newTotal, members: newMembers })
    setIsBillForm(!isBillForm)
  }
  const removeBillImg = () => {
    uploadBillImgRef.current.value = null
    formik.setValues({ ...formik.values, billImg: null, total: 0 })
  }

  useEffect(() => {
    if (formik.values.billImg) {
      formik.setValues({ ...formik.values, billImgTotal: formik.values.total })
    }
  }, [formik.values.total])
  return (
    <>
      <Formik onSubmit={formik.handleSubmit} style={{ textAlign: 'left', margin: '10px 20px' }}>
        <Form>
          <Button sx={{ float: 'right' }} variant="outlined" color="error">
            Delete
          </Button>
          <Preview file={formik.values.billImg} removeBillImg={removeBillImg} />
          <Tooltip
            title={isBillForm ? 'Only the bill image or the bill form' : 'Upload a receipt image'}
            placement="right"
          >
            <span>
              <Button
                disabled={isBillForm}
                htmlFor="billImg"
                color="primary"
                variant="contained"
                onClick={clickUploadBill}
              >
                {formik.values.billImg ? 'Changed the bill image' : 'Upload the bill image'}
              </Button>
              <input
                name="billImg"
                id="billImg"
                ref={uploadBillImgRef}
                onChange={(e) => setImgValue(e)}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
              />
            </span>
          </Tooltip>
          <br /> <br />
          {formik.values.billImg ? (
            <>
              <label>Total: </label>
              <TextField
                name="total"
                id="total"
                type="number"
                onChange={(e) => handleBillImgTotalChange(e)}
                value={formik.values.total}
              />
            </>
          ) : null}
          <br /> <br />
          <Tooltip
            title={
              formik.values.billImg
                ? 'Only the bill image or the bill form'
                : 'Open a form table to enter bill details'
            }
            placement="right"
          >
            <span>
              <Button
                disabled={formik.values.billImg != null}
                color="primary"
                variant="contained"
                onClick={toggleBillForm}
              >
                {isBillForm ? 'Remove the bill table' : 'Enter the bill manually'}
              </Button>
            </span>
          </Tooltip>
          {isBillForm ? (
            <TableContainer>
              <Table sx={{ maxWidth: '60vw' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {formik.values.billDesc
                    ? formik.values.billDesc.map((elem, index) => (
                        <TableRow>
                          <TableCell>
                            <TextField
                              value={formik.values.billDesc[index]}
                              multiline
                              onChange={(e) => handleDescChange(e, index)}
                              sx={{ width: '40vw' }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              sx={{ width: '200px ' }}
                              value={formik.values.billPrice[index]}
                              onChange={(e) => handlePriceChange(e, index)}
                              type="number"
                            />
                          </TableCell>
                          <TableCell>
                            <Button onClick={(e) => editBillForm(e, 'add')}>
                              <AddIcon />
                            </Button>
                            <Button onClick={(e) => editBillForm(e, 'remove', index)}>
                              <RemoveIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                  <label>Total: </label>
                  <TextField
                    InputProps={{
                      readOnly: true
                    }}
                    name="total"
                    id="total"
                    type="number"
                    value={formik.values.total}
                  />
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
          <br /> <br />
          {isBillForm || formik.values.billImg ? (
            <TableContainer id="split-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Owned</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <FieldArray name="members">
                    {({ push, remove }) => (
                      <>
                        {formik.values.members.map((elem, index) => {
                          const name = `members[${index}].owned`
                          const name2 = `members[${index}].fixed`
                          return (
                            <TableRow key={index}>
                              <TableCell>
                                <TextField
                                  type="number"
                                  margin="normal"
                                  variant="outlined"
                                  label="owned"
                                  name={name}
                                  value={elem.owned}
                                  onChange={(e) => handleOwnedChange(e, index)}
                                  required
                                />
                                <FormControlLabel
                                  label="Fixed"
                                  name={name2}
                                  value={elem.fixed}
                                  control={<Checkbox checked={elem.fixed} />}
                                  onChange={(e) => handleFixedCheck(e, index)}
                                />
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </>
                    )}
                  </FieldArray>
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </Form>
      </Formik>

      <>
        <pre style={{ textAlign: 'left' }}>
          <strong>Values</strong>
          <br />
          {JSON.stringify(formik.values, null, 2)}
        </pre>
        <pre style={{ textAlign: 'left' }}>
          <strong>Errors</strong>
          <br />
          {JSON.stringify(formik.errors, null, 2)}
        </pre>
      </>
    </>
  )
}

export default ExpenseForm
