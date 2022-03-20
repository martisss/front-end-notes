var sortList = function(head) {
  if(!head || !head.next) return head
  let len = 0
  let cur = head
  while(cur) {
      len++
      cur = cur.next
  }
  let dummmyHead = new ListNode(-1, head)
  for(let sublen=1; sublen<len; sublen<<1) {
      let pre = dummmyHead, curr=pre.next
      while(curr) {
          let head1 = curr
          for(let i=1; i<sublen && curr && curr.next; i++) {
              curr = curr.next
          }
          let head2 = curr.next
          curr.next=null
          curr = head2
          for(let i=1; i<sublen && curr && curr.next; i++) {
              curr = curr.next
          }
          let next = null
          if(curr) {
              next = curr.next
              curr.next = null
          }
          pre.next = merge(head1, head2)
          while(pre.next) {
              pre = pre.next
          }
          curr = next
      }
  }
  return dummmyHead.next
}